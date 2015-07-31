#Node.js library for the Amazon Web Services

[![Build Status](https://travis-ci.org/livelycode/aws-lib.png?branch=master)](https://travis-ci.org/livelycode/aws-lib)

[![NPM](https://nodei.co/npm/aws-lib.png)](https://nodei.co/npm/aws-lib/)

A simple [Node.js](http://nodejs.org/) library to communicate with the Amazon Web Services API.

It includes clients for the following services:

   * [EC2](https://github.com/livelycode/aws-lib/blob/master/examples/ec2.js)
   * [Product Advertising API](https://github.com/livelycode/aws-lib/blob/master/examples/prod-adv.js)
   * [SimpleDB](https://github.com/livelycode/aws-lib/blob/master/test/simpledb.js)
   * [SQS (Simple Queue Service)](https://github.com/livelycode/aws-lib/blob/master/examples/sqs.js)
   * SNS (Simple Notification Service)
   * [SES (Simple Email Service)](https://github.com/livelycode/aws-lib/blob/master/examples/ses.js)
   * [ELB (Elastic Load Balancing Service)](https://github.com/livelycode/aws-lib/blob/master/examples/elb.js)
   * [CW (CloudWatch)](https://github.com/livelycode/aws-lib/blob/master/examples/cw.js)
   * [IAM (Identity and Access Management)](https://github.com/livelycode/aws-lib/blob/master/examples/iam.js)
   * [CFN (CloudFormation)](https://github.com/livelycode/aws-lib/blob/master/test/cfn.js)
   * STS (Security Token Service)
   * [Elastic MapReduce](https://github.com/livelycode/aws-lib/blob/master/test/emr.js)

Richard Rodger maintains a user-friendly [SimpleDB library](http://github.com/rjrodger/simpledb) which is based on aws-lib.

## Usage

The following snippet implements an ec2 client and makes a call to DescribeInstances

``` js
var aws = require("aws-lib");

ec2 = aws.createEC2Client(yourAccessKeyId, yourSecretAccessKey);

ec2.call("DescribeInstances", {}, function(err, result) {
  console.log(result);
})
```

Which returns a JSON response similar to:

``` js
[...]
{"item":{
  "instanceId":"i-acb2d1db","imageId":"ami-03765c77",
  "instanceState": {"code":"80","name":"stopped"},
  "privateDnsName":{},"dnsName":{},
  "reason":"User initiated (2010-07-28 19:37:54 GMT)"
[...]
```

Another example, using Product Advertising API:

``` js
var prodAdv = aws.createProdAdvClient(yourAccessKeyId, yourSecretAccessKey, yourAssociateTag);

var options = {SearchIndex: "Books", Keywords: "Javascript"}

prodAdv.call("ItemSearch", options, function(err, result) {
  console.log(result);
})
```

Will return a long list of books.

Most clients, such as ec2, ses, simpledb, etc. accept an optional third parameter `options` which should be an object of options used to instantiate the client.  For example, the ec2 client could be instantiated with an options object like:

``` js
ec2 = aws.createEC2Client(yourAccessKeyId, yourSecretAccessKey, {version: '2010-08-31'});
```
    
which would instantiate the ec2 client, but using the 2010-08-31 API version.  

The example below shows how you can filter results using one of the list of filters documented in the AWS API docs. See the library code for each service to learn about other possible options.

``` js
var options = {
  host: "ec2.eu-west-1.amazonaws.com", // use a different region to the default
  version: "2010-08-31"
};

ec2 = aws.createEC2Client(yourAccessKeyId, yourSecretAccessKey, options);

// create a filter for instances with `mytagname = mytagvalue`
var params = {
  "Filter.1.Name": "tag:mytagname",
  "Filter.1.Value.1": "mytagvalue"
}

ec2.call("DescribeInstances", params, function(err, result) {
  console.log(result);
})
```

For more examples have a look at [/examples](https://github.com/livelycode/aws-lib/tree/master/examples) and [/test](https://github.com/livelycode/aws-lib/tree/master/test).

## Credentials, metadata API, and IAM Roles

If you use aws-lib on EC2s it is necessary to distribute your AWS API access key and secret id to each EC2 in order to authenticate requests.  [IAM Roles](http://docs.amazonwebservices.com/AWSEC2/latest/UserGuide/UsingIAM.html#UsingIAMrolesWithAmazonEC2Instances) removes the need to manually distribute your AWS API access key and secret id to EC2s.  Create an IAM role(s) and assign to your EC2s (CloudFormation supports IAM Roles). An access key, secret id, and token will then be provided on the EC2 metadata API.  You can then use aws-lib without passing in any credentials to API clients.  For example:

``` js
var aws = require("aws-lib");
ec2 = aws.createEC2Client(); // Notice no access key nor secret id passed in to client
ec2.call("DescribeInstances", {}, function(err, result) {
  console.log(JSON.stringify(result));
});
```

If no access key or secret id are passed in to the client, aws-lib will attempt to look up the credentials from the EC2 metadata API.  The metadata API can also be used like other aws-lib API clients, such as:

``` js
var aws = require("aws-lib");
var md = aws.createMetaDataClient();
md.call({endpoint: "instance-id"}, function(err, res) {
  console.log(res); // outputs this EC2's instance-id.
});
```

## Tests
In order to run the tests you need to copy "test/credentials_template.js" to "test/credentials.js" and add your access key and secret.  
credentials.js is part of .gitignore so you don't have to worry about accidentially commiting your secret.

To run the tests execute:

    npm test


## Contributing
*At livelycode we currently can't invest enough time to merge and test all new contributions. So our friends at [mapbox](https://github.com/mapbox) offered to jump in and help maintain this library. We have granted [Ian Ward](https://github.com/ianshward) commit access to this repository.*

aws-lib is designed to be easily extensible.  
If you want to add support for a service, have a look at an [existing client](https://github.com/livelycode/aws-lib/blob/master/lib/ec2.js) and simply follow the pattern.  
When submitting a pull request please add a test for at least one API call.

Many thanks to the following people who have contributed so far (ordered by number of commits):

```
Mirko Kiefer
Paul Bonser
Bernhard K. Weisshuhn
Kent
David Valentiate
Richard Rodger
Sean Coates
john
Jonathan Leibiusky
Matt Duncan
Cameron Gray
Bryon
nagoodman
Blake Matheny
Van Nguyen
Ian Ward
Johannes Auer
Chris Castle
Mike MacCana
```
