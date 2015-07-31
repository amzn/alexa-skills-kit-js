#Sample AWS Lambda function for Alexa
A simple [AWS Lambda](http://aws.amazon.com/lambda) function that demonstrates how to write a skill for the Amazon Echo using the Alexa SDK.

## Concepts
This sample shows how to create a Lambda function for handling Alexa Skill requests that:

- Web service: Communicate with an the Amazon associates API to get best seller information using [aws-lib](https://github.com/livelycode/aws-lib)
- Dialog and Session State: Handles two models, both a one-shot ask and tell model, and a multi-turn dialog model.
  If the user provides an incorrect slot in a one-shot model, it will direct to the dialog model
- Pagination: Handles paginating a list of responses to avoid overwhelming the customer.

## Setup
To run this example skill you need to do two things. The first is to deploy the example code in lambda, and the second is to configure the Alexa skill to use Lambda.

### AWS Lambda Setup
1. Go to the AWS Console and click on the Lambda link. Note: ensure you are in us-east or you won't be able to use Alexa with Lambda.
2. Click on the Create a Lambda Function or Get Started Now button.
3. Skip the blueprint
4. Name the Lambda Function "Savvy-Consumer-Example-Skill".
5. Select the runtime as Node.js
5. Go to the the src directory, select all files and then create a zip file, make sure the zip file does not contain the src directory itself, otherwise Lambda function will not work.
6. Select Code entry type as "Upload a .ZIP file" and then upload the .zip file to the Lambda
7. Keep the Handler as index.handler (this refers to the main js file in the zip).
8. Create a basic execution role and click create.
9. Leave the Advanced settings as the defaults.
10. Click "Next" and review the settings then click "Create Function"
11. Click the "Event Sources" tab and select "Add event source"
12. Set the Event Source type as Alexa Skills kit and Enable it now. Click Submit.
13. Copy the ARN from the top right to be used later in the Alexa Skill Setup

### Alexa Skill Setup
1. Go to the [Alexa Console](https://developer.amazon.com/edw/home.html) and click Add a New Skill.
2. Set "Savvy Consumer" as the skill name and "savvy consumer" as the invocation name, this is what is used to activate your skill. For example you would say: "Alexa, Ask Savvy Consumer for top books."
3. Select the Lambda ARN for the skill Endpoint and paste the ARN copied from above. Click Next.
4. Copy the Intent Schema from the included IntentSchema.json.
5. Copy the Sample Utterances from the included SampleUtterances.txt. Click Next.
6. [optional] go back to the skill Information tab and copy the appId. Paste the appId into the index.js file for the variable APP_ID,
   then update the lambda source zip file with this change and upload to lambda again, this step makes sure the lambda function only serves request from authorized source.
7. You are now able to start testing your sample skill! You should be able to go to the [Echo webpage](http://echo.amazon.com/#skills) and see your skill enabled.
8. In order to test it, try to say some of the Sample Utterances from the Examples section below.
9. Your skill is now saved and once you are finished testing you can continue to publish your skill.

### Savvy Consumer Setup
In order to get the savvy consumer sample skill working, you will need to enter your access and secret key for AWS into index.js:

1. Go to the [AWS console](https://console.aws.amazon.com/)
2. Click on your name/login in the top bar and select security credentials
3. Copy the access key and secret key.
4. Paste them into the variables in index.js.
5. Zip the src directory again, and upload it to Lambda.

In addition, you will need to create an Amazon Product API account with the same AWS account.

1. Go to the [Product Advertising API](https://affiliate-program.amazon.com/gp/advertising/api/detail/main.html) website.
2. Click on sign up now.
3. Follow the prompts and sign up with your aws account.

## Examples
### One-shot model
     User:  "Alexa, ask Savvy Consumer for top books"
     Alexa: "Here are the top sellers for books. The top seller is .... Would you like
             to hear more?"
     User:  "No"

### Dialog model:
     User:  "Alexa, open Savvy Consumer"
     Alexa: "Welcome to the Savvy Consumer. For which category do you want to hear the best sellers?"
     User:  "books"
     Alexa: "Here are the top sellers for books. The top seller is .... Would you like
             to hear more?"
     User:  "yes"
     Alexa: "Second ... Third... Fourth... Would you like to hear more?"
     User : "no"
