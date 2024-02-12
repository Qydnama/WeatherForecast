const localization = {
    en: {
        nameError: "Name must be at least 3 letters long and contain only letters",
        emailError: "Enter a valid email address.",
        passwordError: "Password must be at least 3 characters long and not contain special characters",
        confirmPasswordError: "Passwords do not match",
        userExists: "A user with this email already exists",
        registrationSuccessful: "Successful Registration",
        registrationFailed: "Registration failed",
        userNotFound: "User not found or wrong email",
        loginAdminSuccessful: "Successful Login to Admin",
        loginUserSuccessful: "Successful Login"
    },
    ru: {
        nameError: "Имя должно быть не менее 3 букв и содержать только буквы",
        emailError: "Введите правильный адрес электронной почты.",
        passwordError: "Пароль должен быть не менее 3 символов и не содержать специальные символы",
        confirmPasswordError: "Пароли не совпадают",
        userExists: "Пользователь с такой почтой уже существует",
        registrationSuccessful: "Успешная регистрация",
        registrationFailed: "Регистрация провалилась",
        userNotFound: "Пользователь не найден или неправильный пароль",
        loginAdminSuccessful: "Успешный вход в профиль Админа",
        loginUserSuccessful: "Успешный вход"
    }
};

const currentLang = document.documentElement.lang;



function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();



function validateName() {
    const nameInput = document.getElementById("full_name");
    const nameError = document.getElementById("full_nameError");

    const name = nameInput.value;

    function isValidName(name) {
        //Russian, English or Kazakh letters 
        const namePattern = /^[А-Яа-яA-Za-zҚқҢңҒғІіІі]*$/;
        return namePattern.test(name);
    }

    if (name.length === 0 || name.length < 3 || !isValidName(name)) {
        displayError("full_nameError", localization[currentLang].nameError);
        setInvalid(nameInput)
    } else {
        displayError("full_nameError", "");
        setValid(nameInput)
    }
}


function validateEmail() {
    const emailInput = document.getElementById("your_email");
    const emailError = document.getElementById("your_emailError");

    const email = emailInput.value;

    function isValidEmail(email) {
        //email requirements 
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }

    if (!isValidEmail(email) || email.length === 0) {
        displayError("your_emailError", localization[currentLang].emailError);
        setInvalid(emailInput)
    } else {
        displayError("your_emailError", "");
        setValid(emailInput)
    }
}


function validatePassword() {
    const pw = document.getElementById("password");
    const passwordError = document.getElementById("passwordError")
    const password = pw.value;

    function isValidPassword(password) {
        const passwordPattern = /^[А-Яа-яA-Za-z0-9]{3,}$/;
        return passwordPattern.test(password);
    }

    if (password.length === 0 || password.length < 3 || !isValidPassword(password)) {
        displayError("passwordError", localization[currentLang].passwordError);
        setInvalid(pw)
    } else {
        displayError("passwordError", "");
        setValid(pw)
    }
}

function validateConfirmPassword() {
    const confirmPassword = document.getElementById("confirm_password");
    const confirmPasswordError = document.getElementById("confirm_passwordError")
    const confirmValue = confirmPassword.value;
    const pw = document.getElementById("password");

    function isValidPassword(confirm_password) {
        const passwordPattern = /^[А-Яа-яA-Za-z0-9]{3,}$/;
        return passwordPattern.test(confirm_password);
    }

    if (confirmValue.length === 0 || confirmValue.length < 3 || !isValidPassword(confirmValue)) {
        displayError("confirm_passwordError", localization[currentLang].passwordError);
        setInvalid(confirmPassword)
    }
    else if (confirmValue != pw.value) {
        displayError("confirm_passwordError", localization[currentLang].confirmPasswordError)
        setInvalid(confirmPassword)
    }
    else {
        displayError("confirm_passwordError", "")
        setValid(confirmPassword)
    }
}



async function registerUser() {
    validateName();
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    var username = document.getElementById("full_name").value;
    var email = document.getElementById("your_email").value;
    var password = document.getElementById("password").value;


    const form = document.getElementById('myForm');

    if (form.getElementsByClassName("is-valid").length == 4) {
        const emailCheck = await fetch(`/user/get/email/${email}`, {
            method: 'GET',
        });
        if (emailCheck.status == 422) {
            registerToDB(username, email, password);
        }
        else {
            alert(localization[currentLang].userExists);
            window.location.reload();
        }
    }

}

async function registerToDB(name, email, password) {
    const response = await fetch('/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
        alert(localization[currentLang].registrationSuccessful);
    } else {
        const errorMessage = await response.text();
        alert(`${localization[currentLang].registrationFailed}: ${errorMessage}`);
    }
    window.location.reload();
}



function validateLoginEmail() {
    const emailInput = document.getElementById("emailLogin");
    const emailError = document.getElementById("emailLoginError");

    const email = emailInput.value;

    function isValidEmail(email) {
        //email requirements 
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }

    if (!isValidEmail(email) || email.length === 0) {
        displayError("emailLoginError", localization[currentLang].emailError);
        setInvalid(emailInput)
    } else {
        displayError("emailLoginError", "");
        setValid(emailInput);
    }
}

function validateLoginPassword() {
    const pw = document.getElementById("password_1");
    const passwordError = document.getElementById("password_1Error")
    const password = pw.value;

    function isValidPassword(password) {
        const passwordPattern = /^[А-Яа-яA-Za-z0-9]{3,}$/;
        return passwordPattern.test(password);
    }

    if (password.length === 0 || password.length < 3 || !isValidPassword(password)) {
        displayError("password_1Error", localization[currentLang].passwordError);
        setInvalid(pw)
    } else {
        displayError("password_1Error", "");
        setValid(pw)
    }
}

async function loginUser() {
    validateLoginEmail();
    validateLoginPassword();

    let email = document.getElementById("emailLogin").value;
    let password = document.getElementById("password_1").value;

    const form = document.getElementById('yourForm');
    
    if (form.getElementsByClassName("is-valid").length == 2) {
        const user = await fetch('/user/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (user.ok) {
            const userData = await user.json();

            if (userData.isAdmin == true) {
                alert(localization[currentLang].loginAdminSuccessful);
                window.location.href = `/forecast?lang=${currentLang}`;
            }
            else {
                alert(localization[currentLang].loginUserSuccessful);
                window.location.href = `/forecast?lang=${currentLang}`;
            } 
        } else {
            alert(localization[currentLang].userNotFound);
            
        }
    }
}

function displayError(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.style.display = "block";
    errorElement.textContent = message;
    document.getElementById(id.replace("Error", "")).classList.add("error-border");
}

function resetForm() {
    const errorElements = document.querySelectorAll(".error");
    const inputFields = document.querySelectorAll(".input-text");

    errorElements.forEach((element) => {
        element.style.display = "none";
    });

    inputFields.forEach((field) => {
        field.classList.remove("error-border");
    });
}

function setInvalid(element) {
    element.classList.add('is-invalid');
    element.classList.remove('is-valid')
}

function setValid(element) {
    element.classList.add('is-valid');
    element.classList.remove('is-invalid')
};



