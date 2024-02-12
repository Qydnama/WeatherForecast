const express = require('express');
const router = express.Router();
const { User } = require('../models/user')
const bcrypt = require('bcryptjs');
const { checkAuthenticated, checkAdmin } = require('../middleware/authHandler');


router.get('/admin',checkAdmin, async (req, res) => {
    try {
        let userList = await User.find().select('-passwordHash'); 

        if(!userList) {
            return res.status(400).send('Users not found');
        }
        res.render('user/admin', { users: userList });
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Error getting all users data');
    }
});

router.put(`/admin/:id`,checkAdmin, async (req, res) => {

    let user = await User.findById(req.params.id);
        if(!user) {
            return res.status(400).send('User not found');
        }
    
    user.name = req.body.name;
    user.email = req.body.email;
    user.isAdmin = req.body.isAdmin;
    user.updatedAt = Date.now();

    user = await user.save();

    return res.status(200).send(user);
});


router.post(`/admin`,checkAdmin, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin
    });
    
    if(!user) {
        return res.status(400).send('User cannot be created');
    }

    user = await user.save();

    res.status(200).send(user);
});


router.delete('/admin/:id',checkAdmin, async (req, res) => {
    let user = await User.findByIdAndDelete(req.params.id);

    if (user) {
        return res.status(200).json({ success: true, message: "User is deleted" });
    } else {
        return res.status(404).json({ success: false, message: "User not found" });
    }
});

router.put(`/update-user/:id`,checkAuthenticated, async (req, res) => {

    let user = await User.findById(req.params.id);
        if(!user) {
            return res.status(400).send('User not found');
        }
    
    user.name = req.body.name
    user.email = req.body.email
    if (req.body.password !== '')
    user.passwordHash = bcrypt.hashSync(req.body.password, 10)

    user = await user.save();

    return res.status(200).send(user);
});

router.post(`/register`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        // isAdmin: req.body.isAdmin
    });
    
    if(!user) {
        return res.status(400).send('User cannot be created');
    }

    user = await user.save();

    res.status(200).send(user);
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        
        if (!user) {
            return res.status(400).send('The user not found');
        }
        
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.passwordHash);
        
        if (!isPasswordCorrect) {
            return res.status(400).send('Password is wrong!');
        }
        
        req.session.user = { id: user.id, isAdmin: user.isAdmin };
        
        await User.findByIdAndUpdate(user.id, { lastLogged: Date.now() });

        res.status(200).send({ isAdmin: user.isAdmin });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error while log in');
    }
});

router.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            return console.error(err);
        }
        res.redirect('/');
    });

});


router.get(`/get/count`, checkAuthenticated, async (req,res) => {
    const userCount = await User.countDocuments();
    
    if(!userCount) {
        res.status(500).json({success: false});
    }
    res.send({
        count: userCount
    });
});

router.get(`/get/id/:id`, checkAuthenticated, async (req,res) => {
    const userList = await User.findById(req.params.id).select("-passwordHash");
    
    if(!userList) {
        res.status(500).json({success: false});
    }
    res.send(userList);
});

router.get(`/get/email/:email`, async (req,res) => {
    const userList = await User.find({email: req.params.email});
    if(!userList || userList.length === 0) {
        return res.status(422).json({ success: false});
    } else {
        return res.status(200).send(userList);
    }
});



router.post('/check-password/:id',checkAuthenticated, async (req,res) => {
    const user = await User.findById(req.params.id);
    
    if (!user || !req.body.password) {
        return res.status(400).send('The user not found or wrong password');
    }
    if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
        return res.status(200).send({password: req.body.password});
    } else {
        return res.status(400).send('Password is wrong!');
    }
});

module.exports = router;