var assert = require('assert');
var aws = require('../lib/aws');
var credentials = require('./credentials');

var cfn = aws.createCFNClient(credentials.accessKeyId, credentials.secretAccessKey);

describe('CFNClient', function() {
  describe('DescribeStacks', function() {
    it('should return list of stacks', function(done) {
      cfn.call('DescribeStacks', {}, function(err, res) {
        assert.ok(res.DescribeStacksResult);
        done(err);
      })
    })
  })
});
