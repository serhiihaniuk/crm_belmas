const validateCredentials = (login, password) => {
    const loginRegex = /^[a-zA-Z0-9]{3,20}$/;
    const passwordRegex = /^[a-zA-Z0-9]{3,20}$/;

    if (!loginRegex.test(login)) {
        throw new Error('Login is invalid');
    }
    if (!passwordRegex.test(password)) {
        throw new Error('Password is invalid');
    }
    return true;
}

exports.validateCredentials = validateCredentials;
