var aws = require ('aws-lib');

var awsKey = "";
var awsPrivateKey = "";

// See "http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/"
// General SQS actions do not require a "path" (CreateQueue, ListQueue, etc)

sqs = aws.createSQSClient( awsKey, awsPrivateKey);

sqs.call ( "ListQueues", {}, function (err, result) { 
    console.log("ListQueues result: " + JSON.stringify(result)); 
});


// Specific Queue options (CreateMessage, DeleteMessage, etc)
// need a specific path 
// http://sqs.us-east-1.amazonaws.com/123456789012/testQueue/
// /accountid/queue_name
var options = {
    "path" : "/123456789012/testQueue/"  
};
var outbound = {
    MessageBody : "Test Message"  
};

sqs = aws.createSQSClient(awsKey, awsPrivateKey, options);
sqs.call ( "SendMessage", outbound, function (err, result ) {
    console.log("result: " + JSON.stringify(result)); 
});
    
