const localization = {
    en: {
        confirmDelete: "Are you sure you wanted to delete this user?"
    },
    ru: {
        confirmDelete: "Вы уверены, что хотите удалить этого пользователя?"
    }
};

const currentLang = document.documentElement.lang;

const addUserForm = document.getElementById('addUserForm');

addUserForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isAdmin = document.getElementById('isAdmin').checked;

    const userData = {
        name: name,
        email: email,
        password: password,
        isAdmin: isAdmin
    };

    axios.post('/user/admin', userData)
        .then(function() {
            window.location.reload();
        })
        .catch(function(error) {
            console.error('Ошибка при добавлении пользователя:', error);
        });
});

function setEditModalData(userId, name, email, isAdmin) {
    const editUserForm = document.getElementById('editUserForm');
    editUserForm.setAttribute('data-user-id', userId);
    document.getElementById('editUsername').value = name;
    document.getElementById('editEmail').value = email;
    document.getElementById('editIsAdmin').checked = isAdmin === 'true';

}

const editUserForm = document.getElementById('editUserForm');

editUserForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const userId = editUserForm.getAttribute('data-user-id');
    const name = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;
    const isAdmin = document.getElementById('editIsAdmin').checked;

    const userData = {
        name: name,
        email: email,
        isAdmin: isAdmin
    };

    axios.put(`/user/admin/${userId}`, userData)
        .then(function() {
            window.location.reload();
        })
        .catch(function(error) {
            console.error('Ошибка при обновлении пользователя:', error);
        });
});

function deleteUser(userId) {
    if (confirm(`${localization[currentLang].confirmDelete}`)) {
        axios.delete(`/user/admin/${userId}`)
            .then(function() {
                window.location.reload();
            })
            .catch(function(error) {
                console.error('Ошибка при удалении пользователя:', error);
            });
    }
}
