// Create a new user and key pair

var aws = require("aws-lib");

iam = aws.createIAMClient(yourAccessKeyId, yourSecretAccessKey);

var params = {
  UserName: "TestUser"
}

iam.call("CreateUser", params, function(err, result) {
  if (result["Error"]) {
    console.log(JSON.stringify(result));
  }
  else {
    params = {
      UserName: params["UserName"]
    }
    iam.call("CreateAccessKey", params, function(err, result) {
      console.log(JSON.stringify(result));
    });
  }
});
