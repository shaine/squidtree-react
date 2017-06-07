const sodium = require('sodium').api;

exports.hashPassword = function hashPassword(password) {
    const hash = new Buffer(sodium.crypto_pwhash_STRBYTES);
    const passwordBuffer = new Buffer(password);

    const hashBuffer = sodium.crypto_pwhash_str(
        passwordBuffer,
        sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
    );

    return hashBuffer.toString();
}

exports.verifyPassword = function verifyPassword(password, passwordHash) {
    return sodium.crypto_pwhash_str_verify(
        new Buffer(passwordHash),
        new Buffer(password)
    );
}
