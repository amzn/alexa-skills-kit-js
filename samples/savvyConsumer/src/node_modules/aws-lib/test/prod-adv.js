
assert = require('assert');
aws = require('../lib/aws');
credentials = require('./credentials');

prodAdv = aws.createProdAdvClient(credentials.accessKeyId, credentials.secretAccessKey, "");

describe('Product Advertisement API', function() {
  describe('ItemSearch', function() {
    it('should return filtered products', function(done) {
      prodAdv.call("ItemSearch", {SearchIndex: "Books", Keywords: "Javascript"}, function(err, res) {
        assert.ok(res.Items);
        done(err)
      })
    })
  })
})