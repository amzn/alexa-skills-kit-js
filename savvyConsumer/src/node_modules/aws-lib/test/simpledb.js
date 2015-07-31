
assert = require('assert');
aws = require('../lib/aws');
credentials = require('./credentials');

sdb = aws.createSimpleDBClient(credentials.accessKeyId, credentials.secretAccessKey, {secure:false});

describe('simpledb', function() {
  describe('ListDomains', function() {
    it('should return all domains', function(done) {
      sdb.call("ListDomains", {}, function(err, res) {
        assert.ok(res.ListDomainsResult);
        done(err);
      })
    })
    it('should return all domains filtered', function(done) {
      sdb.call("ListDomains", {MaxNumberOfDomains: 1}, done)
    })
  })
})