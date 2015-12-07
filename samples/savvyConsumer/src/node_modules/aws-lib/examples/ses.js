var aws = require("../lib/aws");

ses = aws.createSESClient(yourAccessKeyId, yourSecretAccessKey);

ses.call("GetSendQuota", {}, function(err, result) {
  console.log(JSON.stringify(result));
});

ses.call("GetSendStatistics", {}, function(err, result) {
  console.log(JSON.stringify(result));
});

ses.call("ListVerifiedEmailAddresses", {}, function(err, result) {
  console.log(JSON.stringify(result));
});

var recipient_address = 'test@example.com';
var sender_address = 'test@example.com';
var send_args = {
	'Destination.ToAddresses.member.1': recipient_address,
	'Message.Body.Text.Charset': 'UTF-8',
	'Message.Body.Text.Data': 'Hello text body!',
	'Message.Body.Html.Charset': 'UTF-8',
	'Message.Body.Html.Data': '<b>Hello body!</b>',
	'Message.Subject.Charset': 'UTF-8',
	'Message.Subject.Data': 'Test subject',
	'Source': sender_address
};
ses.call('SendEmail', send_args, function(err, result) {
	console.log(result);
});
