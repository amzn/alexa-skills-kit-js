
assert = require('assert');
aws = require('../lib/aws');
credentials = require('./credentials');

emr = aws.createEMRClient(credentials.accessKeyId, credentials.secretAccessKey);

describe('EMRClient', function() {
  describe('DescribeJobFlows', function() {
    it('should return jobflows', function(done) {
      emr.call("DescribeJobFlows", {}, function(err, res) {
        assert.ok(res.DescribeJobFlowsResult);
        done(err);
      })
    })
  })
})
