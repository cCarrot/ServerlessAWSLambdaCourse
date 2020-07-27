module.exports = password => {
    if (password.length < 6) {
        return Promise.reject({
            message: 'El password es demasiado corto'
        })
    } 

    return Promise.resolve('El password pasa la validación');
};
