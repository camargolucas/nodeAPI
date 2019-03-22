'use strict'

const error = 'error'
const success = 'success'
module.exports.jsonStatusReturn  = {

    'success':    1,
    'error':      2

}
exports.generatePassword = function() {
    var pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var pwdLen = 10;
    return Array(pwdLen).fill(pwdChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
}