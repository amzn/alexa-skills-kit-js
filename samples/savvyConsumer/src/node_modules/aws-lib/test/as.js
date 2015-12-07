
assert = require('assert');
aws = require('../lib/aws');
credentials = require('./credentials');

as = aws.createASClient(credentials.accessKeyId, credentials.secretAccessKey);

describe('as', function() {
  describe('DescribeAutoScalingGroups', function() {
    it('should return a list to Auto Scaling groups', function(done) {
      as.call("DescribeAutoScalingGroups", {}, function(err, res) {
        assert.ok(res.DescribeAutoScalingGroupsResult);
        done(err);
      })
    })
  })
})