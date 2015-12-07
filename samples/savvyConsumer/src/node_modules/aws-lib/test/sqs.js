
assert = require('assert');
aws = require('../lib/aws');
credentials = require('./credentials');

sqs = aws.createSQSClient(credentials.accessKeyId, credentials.secretAccessKey);

describe('sqs', function() {
  describe('ListQueues', function() {
    it('should return all queues', function(done) {
      sqs.call('ListQueues', {}, function (err, res) {
        assert.ok(res.ListQueuesResult);
        done(err);
      });
    });
  });

  describe('CreateQueue', function() {
    var queueName;
    var queueSqs;

    beforeEach(function(done) {
      require('crypto').randomBytes(16, function(err, buf) {
        queueName = 'test-' + buf.toString('hex');
        done(err);
      });
      queueSqs = null;
    });

    afterEach(function(done) {
      queueSqs.call('DeleteQueue', {}, done);
    });

    it('should create the queue with the specified attributes', function(done) {
      var params = {
        'QueueName': queueName,
        'Attribute.1.Name': 'VisibilityTimeout',
        'Attribute.1.Value': 1234
      };

      sqs.call('CreateQueue', params, function(err, res) {
        var queuePath = require('url').parse(res.CreateQueueResult.QueueUrl).path;
        queueSqs = aws.createSQSClient(credentials.accessKeyId, credentials.secretAccessKey, { path: queuePath });

        queueSqs.call('GetQueueAttributes', { 'AttributeName.1': 'VisibilityTimeout' }, function(err, res) {
          assert.equal(res.GetQueueAttributesResult.Attribute.Value, '1234');
          done(err);
        });
      });
    });
  });
});
