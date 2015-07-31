#Sample AWS Lambda function for Alexa
A simple [AWS Lambda](http://aws.amazon.com/lambda) function that demonstrates how to write a skill for the Amazon Echo using the Alexa SDK.

## Concepts
This sample shows how to create a Lambda function for handling Alexa Skill requests that:

- Web service: communicate with an external web service to get tide data from the [NOAA CO-OPS API](http://tidesandcurrents.noaa.gov/api/)
- Multiple optional slots: has 2 slots (city and date), where the user can provide 0, 1, or 2 values, and assumes defaults for the unprovided values
- DATE slot: demonstrates date handling and formatted date responses appropriate for speech
- LITERAL slot: demonstrates literal handling for a finite set of known values
- Dialog and Session state: Handles two models, both a one-shot ask and tell model, and a multi-turn dialog model.
  If the user provides an incorrect slot in a one-shot model, it will direct to the dialog model. See the
  examples section for sample interactions of these models.

## Setup
To run this example skill you need to do two things. The first is to deploy the example code in lambda, and the second is to configure the Alexa skill to use Lambda.

### AWS Lambda Setup
1. Go to the AWS Console and click on the Lambda link. Note: ensure you are in us-east or you won't be able to use Alexa with Lambda.
2. Click on the Create a Lambda Function or Get Started Now button.
3. Skip the blueprint
4. Name the Lambda Function "Tide-Pooler-Example-Skill".
5. Select the runtime as Node.js
5. Go to the the src directory, select all files and then create a zip file, make sure the zip file does not contain the src directory itself, otherwise Lambda function will not work.
6. Select Code entry type as "Upload a .ZIP file" and then upload the .zip file to the Lambda
7. Keep the Handler as index.handler (this refers to the main js file in the zip).
8. Create a basic execution role and click create.
9. Leave the Advanced settings as the defaults.
10. Click "Next" and review the settings then click "Create Function"
11. Click the "Event Sources" tab and select "Add event source"
12. Set the Event Source type as Alexa Skills kit and Enable it now. Click Submit.
13. Copy the ARN from the top right to be used later in the Alexa Skill Setup.

### Alexa Skill Setup
1. Go to the [Alexa Console](https://developer.amazon.com/edw/home.html) and click Add a New Skill.
2. Set "Tide Pooler" for the skill name and "tide pooler" as the invocation name, this is what is used to activate your skill. For example you would say: "Alexa, Ask tide pooler when is high tide in Seattle."
3. Select the Lambda ARN for the skill Endpoint and paste the ARN copied from above. Click Next.
4. Copy the Intent Schema from the included IntentSchema.json.
5. Copy the Sample Utterances from the included SampleUtterances.txt. Click Next.
6. [optional] go back to the skill Information tab and copy the appId. Paste the appId into the index.js file for the variable APP_ID,
   then update the lambda source zip file with this change and upload to lambda again, this step makes sure the lambda function only serves request from authorized source.
7. You are now able to start testing your sample skill! You should be able to go to the [Echo webpage](http://echo.amazon.com/#skills) and see your skill enabled.
8. In order to test it, try to say some of the Sample Utterances from the Examples section below.
9. Your skill is now saved and once you are finished testing you can continue to publish your skill.

## Examples
Example user interactions:

### One-shot model:
    User:  "Alexa, ask Tide Pooler when is the high tide in Seattle on Saturday"
    Alexa: "Saturday June 20th in Seattle the first high tide will be around 7:18 am, and will peak at ..."

### Dialog model:
    User:  "Alexa, open Tide Pooler"
    Alexa: "Welcome to Tide Pooler. Which city would you like tide information for?"
    User:  "Seattle"
    Alexa: "For which date?"
    User:  "this Saturday"
    Alexa: "Saturday June 20th in Seattle the first high tide will be around 7:18 am, and will peak at ..."
