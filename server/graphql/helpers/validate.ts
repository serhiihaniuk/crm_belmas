import log from '../../helpers/info'

export const validateCredentials = (login: string, password: string): true => {
    log.info('validateCredentials','Validating credentials');
    const loginRegex = /^[a-zA-Z0-9]{3,20}$/;
    const passwordRegex = /^[a-zA-Z0-9]{3,20}$/;

    if (!loginRegex.test(login)) {
        log.error('validateCredentials','invalid login');
        throw new Error('Login is invalid');
    }

    if (!passwordRegex.test(password)) {
        log.error('validateCredentials','invalid password');
        throw new Error('Password is invalid');
    }

    log.info('validateCredentials','Credentials are valid');
    return true;
}


