function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

function validateUsername(username) {
    const re = /^[A-Za-z0-9]+$/
    return re.test(String(username))
}

function validateName(name) {
    const re = /^[A-Za-z]+$/
    return re.test(String(name))
}

module.exports = { validateEmail, validateUsername, validateName }