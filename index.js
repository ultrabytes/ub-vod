/*!
 * vod by ultrabytes
 * GPL-3 Licensed
 */

'use strict';


// extend string object
String.prototype.ltrim = function (what) {
    return this.replace(new RegExp("^" + what + "*"), "");
}

String.prototype.rtrim = function (what) {
    return this.replace(new RegExp(what + "*$"), "");
}


module.exports = require('./lib/vod');
