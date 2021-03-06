var pbkdf2 = require('pbkdf2');
var sjcl = require('sjcl');
var assert = require('assert');
var bip39 = require("bip39");

console.log("Let's ROLLLL!");

var mnemonic = "later arrest fit foil goat excess online question trumpet grape license term bounce job nominee nuclear credit artefact measure record buyer service husband april tower average athlete pole alpha law picnic tail prepare satisfy dizzy hire illness legal forum rain sniff ask asthma pond present beach either minimum";
var password = "benchmark";
var salt = "mnemonicbenchmark"; // salt to match bip39
var mnemonicBuffer = new Buffer(mnemonic, 'utf8');
var saltBuffer = new Buffer(salt, 'utf8');
var t, i;

var iter = 5;

// use alert in browsers for when console.log is too much hassle
var debug = typeof window !== "undefined" ? function(msg) { console.log(msg); alert(msg); } : console.log;

// making sure sjcl was build correctly
console.log(sjcl.hash.sha512);
assert(typeof sjcl.hash.sha512 === "function");

var hmacSHA512 = function (key) {
    var hasher = new sjcl.misc.hmac( key, sjcl.hash.sha512 );
    this.encrypt = function () {
        return hasher.encrypt.apply( hasher, arguments );
    };
};

// -------------------------------
t = (new Date).getTime();
var sjclResult;

for (i = 0; i < iter; i++) {
    sjclResult = sjcl.misc.pbkdf2(sjcl.codec.utf8String.toBits(mnemonic), sjcl.codec.utf8String.toBits(salt), 2048, 64 * 8, hmacSHA512);
}
debug("sjcl.misc.pbkdf2 " + ((new Date).getTime() - t) + " = " + (((new Date).getTime() - t) / iter) + "\n" + sjcl.codec.hex.fromBits(sjclResult));

// -------------------------------
t = (new Date).getTime();
var pbkdf2Result;

for (i = 0; i < iter; i++) {
    pbkdf2Result = pbkdf2.pbkdf2Sync(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
}
debug("pbkdf2.pbkdf2Sync " + ((new Date).getTime() - t) + " = " + (((new Date).getTime() - t) / iter) + "\n" + pbkdf2Result.toString('hex'));

// -------------------------------
t = (new Date).getTime();
var bip39Result;

for (i = 0; i < iter; i++) {
    bip39Result = bip39.mnemonicToSeedHex(mnemonic, password);
}
debug("bip39.mnemonicToSeedHex " + ((new Date).getTime() - t) + " = " + (((new Date).getTime() - t) / iter) + "\n" + bip39Result);
