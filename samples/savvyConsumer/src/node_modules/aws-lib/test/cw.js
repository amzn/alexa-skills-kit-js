
assert = require('assert');
aws = require('../lib/aws');
credentials = require('./credentials');

cw = aws.createCWClient(credentials.accessKeyId, credentials.secretAccessKey);

describe('CWClient', function() {
  describe('ListMetrics', function() {
    it('should return metrics', function(done) {
      cw.call("ListMetrics", {}, function(err, res) {
        assert.ok(res.ListMetricsResult);
        done(err);
      })
    })
  })
})