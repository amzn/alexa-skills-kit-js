
assert = require('assert');
aws = require('../lib/aws');
credentials = require('./credentials');

iam = aws.createIAMClient(credentials.accessKeyId, credentials.secretAccessKey);

describe('iam', function() {
  describe('ListUsers', function() {
    it('should return all users', function(done) {
      iam.call("ListUsers", {}, function(err, res) {
        assert.ok(res.ListUsersResult);
        done(err)
      })
    })
  })
})