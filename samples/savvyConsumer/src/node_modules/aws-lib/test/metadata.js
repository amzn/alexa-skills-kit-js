
if (process.env.ON_AWS) {
  test()  
}

function test() {
  var assert = require('assert');
  var aws = require('../lib/aws');
  var nock = require('nock');
  var credentials = require('./credentials');
  var ec2auth = aws.createEC2Client(credentials.accessKeyId, credentials.secretAccessKey);
  var ec2unauth = aws.createEC2Client();
  var md = aws.createMetaDataClient();
  var expires = new Date(+new Date + 10000).toISOString();

  var fake = {
    "Code" : "Success",
    "LastUpdated" : "2012-12-12T21:04:14Z",
    "Type" : "AWS-HMAC",
    "AccessKeyId" : "XXX",
    "SecretAccessKey" : "XXX",
    "Token" : "XXX",
    "Expiration" : expires
  };

  var valid = {
    "Code" : "Success",
    "LastUpdated" : "2012-12-12T21:04:14Z",
    "Type" : "AWS-HMAC",
    "AccessKeyId" : credentials.accessKeyId,
    "SecretAccessKey" : credentials.secretAccessKey,
    "Token" : undefined,
    "Expiration" : expires
  };

  var api = nock('http://169.254.169.254')
    .get('/latest/meta-data/instance-id')
    .reply(200, 'i-abcdef12')
    .get('/latest/meta-data/iam/security-credentials/')
    .reply(200, 'role1')
    .get('/latest/meta-data/iam/security-credentials/')
    .reply(200, 'role1')
    .get('/latest/meta-data/iam/security-credentials/role1')
    .reply(200, fake)
    .get('/latest/meta-data/iam/security-credentials/')
    .reply(200, 'role1')
    .get('/latest/meta-data/iam/security-credentials/role1')
    .reply(200, fake)
    .get('/latest/meta-data/iam/security-credentials/')
    .reply(200, 'role1')
    .get('/latest/meta-data/iam/security-credentials/role1')
    .reply(200, valid);

  describe('metadata api', function() {
    it('should return an instance-id', function(done) {
      md.call({endpoint: 'instance-id'}, function(err, res) {
        assert.equal(res, 'i-abcdef12');
        done(err)
      })
    })
    it('should return a role', function(done) {
      md.call({endpoint: 'iam/security-credentials/'}, function(err, res) {
        assert.equal(res, 'role1');
        done(err)
      })
    })
    it('should return a parsable JSON object', function(done) {
      md.call({endpoint: 'iam/security-credentials/'}, function(err, res) {
        md.call({endpoint: 'iam/security-credentials/' + res}, function(err, res) {
          res = JSON.parse(res);
          assert.equal(res.AccessKeyId, 'XXX');
          done(err)
        });
      })
    })
    // Should use real key/secret
    it('should use provided credentials and return reservation set', function(done) {
      ec2auth.call("DescribeInstances", {}, function(err, res) {
        assert.ok(res.reservationSet);
        done(err)
      })
    })
    // Should look up fake key/secret, and not be able to authenticate
    it('should call metadata api and throw authentication exception', function(done) {
      ec2unauth.call("DescribeInstances", {}, function(err, res) {
        assert.throws(
          function() {
            throw new Error(err);
          },
          /AWS was not able/
        );
        done();
      })
    })
    // Force credentials to expire, which should call metadata API to get new
    // credentials. New credentials will be valid and therefore should result
    // in valid result from ec2 api. Note, causes delay and therefore may
    // cause test timeout.
    it('should re-call metadata api and return ec2 result', function(done) {
      if (Date.parse(expires) > +new Date) {
        setTimeout(function() {
          ec2unauth.call("DescribeInstances", {}, function(err, res) {
            assert.ok(res.reservationSet);
            done(err);
          })
        }, Date.parse(expires) - (+new Date - 2000))
      } else {
          ec2unauth.call("DescribeInstances", {}, function(err, res) {
            assert.ok(res.reservationSet);
            done(err);
          })
      }
    })
  });
}

