
const checkAdmin = async (req, res, next) => {
    try {
        const user = req.session.user
        if (!user) {
            console.error("Unauthorized User");
            return res.status(400).send({message: "Unauthorized User"})
        }
        if (req.session.user.isAdmin === true) {
            next();
        } else {
            console.error("No permission");
            return res.status(400).send({message: "No permission"})
        }
    } catch (err) {
        console.error("Unauthorized User");
        return res.status(400).send({message: "Unauthorized User"})
    }
}

const checkAuthenticated = async (req, res, next) => {
    try {
        const user = req.session.user
        if (!user) {
            console.error("Unauthorized User");
            return res.status(400).send({message: "Unauthorized User"})
        }
        next();
    } catch (err) {
        console.error("Unauthorized User");
        return res.status(400).send({message: "Unauthorized User"})
    }
}



module.exports = { checkAuthenticated, checkAdmin };
