
assert = require('assert');
aws = require('../lib/aws');
credentials = require('./credentials');

var sts = aws.createSTSClient(credentials.accessKeyId, credentials.secretAccessKey);

describe('STSClient', function() {
  describe('GetSessionToken', function() {
    it('should return a token', function(done) {
      sts.call("GetSessionToken", {}, function(err, res) {
        assert.ok(res.GetSessionTokenResult.Credentials);
        done(err);
      })
    })
  })
})