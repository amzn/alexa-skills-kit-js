
var crypto = require("crypto")

exports.hmacSha256 = function (key, toSign) {
  var hash = crypto.createHmac("sha256", key);
  return hash.update(toSign).digest("base64");
}