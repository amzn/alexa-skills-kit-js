
assert = require('assert');
aws = require('../lib/aws');
credentials = require('./credentials');

ses = aws.createSESClient(credentials.accessKeyId, credentials.secretAccessKey);

describe('SESClient', function() {
  describe('GetSendQuota', function() {
    it('should return quota', function(done) {
      ses.call('GetSendQuota', {}, function(err, res) {
        assert.ok(res.GetSendQuotaResult);
        done(err)
      })
    })
  })
})