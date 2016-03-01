/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * This sample shows how to create a simple Trivia skill with a multiple choice format. The skill
 * supports 1 player at a time, and does not support games across sessions.
 */

'use strict';

/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 */
var questions = [
	{
        "Reindeer have very thick coats, how many hairs per square inch do they have?": [
            "13,000",
            "1,200",
            "5,000",
            "700"
        ]
    },
    {
        "The 1964 classic Rudolph The Red Nosed Reindeer was filmed in.": [
            "Japan",
            "United States",
            "Finland",
            "Germany"
        ]
    },
    {
        "Santas reindeer are cared for by one of the Christmas elves, what is his name?": [
            "Wunorse Openslae",
            "Alabaster Snowball",
            "Bushy Evergreen",
            "Pepper Minstix"
        ]
    },
    {
        "If all of Santas reindeer had antlers while pulling his Christmas sleigh, they would all be.": [
            "Girls",
            "Boys",
            "Girls and boys",
            "No way to tell"
        ]
    },
    {
        "What do Reindeer eat?": [
            "Lichen",
            "Grasses",
            "Leaves",
            "Berries"
        ]
    },
    {
        "What of the following is not true?": [
            "Caribou live on all continents.",
            "Both reindeer and Caribou are the same species.",
            "Caribou are bigger than reindeer.",
            "Reindeer live in Scandinavia and Russia."
        ]
    },
    {
        "In what year did Rudolph make his television debut?": [
            "1964",
            "1979",
            "2000",
            "1956"
        ]
    },
    {
        "Who was the voice of Rudolph in the 1964 classic?": [
            "Billie Mae Richards",
            "Burl Ives",
            "Paul Soles",
            "Lady Gaga"
        ]
    },
    {
        "In 1939 what retailer used the story of Rudolph the Red Nose Reindeer?": [
            "Montgomery Ward",
            "Sears",
            "Macys",
            "Kmart"
        ]
    },
    {
        "Santa's reindeer named Donner was originally named what?": [
            "Dunder",
            "Donny",
            "Dweedle",
            "Dreamy"
        ]
    },
    {
        "Who invented the story of Rudolph?": [
            "Robert May",
            "Johnny Marks",
            "Santa",
            "J.K. Rowling"
        ]
    },
    {
        "In what location will you not find reindeer?": [
            "North Pole",
            "Lapland",
            "Korvatunturi mountain",
            "Finland"
        ]
    },
    {
        "What Makes Santa's Reindeer Fly?": [
            "Magical Reindeer Dust",
            "Fusion",
            "Amanita muscaria",
            "Elves"
        ]
    },
    {
        "Including Rudolph, how many reindeer hooves are there?": [
            "36",
            "24",
            "16",
            "8"
        ]
    },
    {
        "Santa only has one female reindeer. Which one is it?": [
            "Vixen",
            "Clarice",
            "Cupid",
            "Cupid"
        ]
    },
    {
        "In the 1964 classic Rudolph The Red Nosed Reindeer, what was the snowman narrators name?": [
            "Sam",
            "Frosty",
            "Burl",
            "Snowy"
        ]
    },
    {
        "What was Rudolph's father's name?": [
            "Donner",
            "Dasher",
            "Blixen",
            "Comet"
        ]
    },
    {
        "In the 1964 movie, What was the name of the coach of the Reindeer Games?": [
            "Comet",
            "Blixen",
            "Donner",
            "Dasher"
        ]
    },
    {
        "In the 1964 movie, what is the name of the deer that Rudolph befriends at the reindeer games?": [
            "Fireball",
            "Clarice",
            "Jumper",
            "Vixen"
        ]
    },
    {
        "In the 1964 movie, How did Donner, Rudolph's father, try to hide Rudolph's nose?": [
            "Black mud",
            "Bag",
            "Pillow case",
            "Sock"
        ]
    },
    {
        "In the 1964 movie, what does the Misfit Elf want to be instead of a Santa Elf?": [
            "Dentist",
            "Reindeer",
            "Toy maker",
            "Candlestick maker"
        ]
    },
    {
        "In the 1964 movie,what was the Bumble's one weakness?": [
            "Could not swim",
            "Always hungry",
            "Candy canes",
            "Cross eyed"
        ]
    },
    {
        "In the 1964 movie, what is Yukon Cornelius really in search of?": [
            "Peppermint",
            "Gold",
            "India",
            "Polar Bears"
        ]
    },
    {
        "In the 1964 movie, why is the train on the Island of Misfit Toys?": [
            "Square wheels",
            "No Engine",
            "Paint does not match",
            "It does not toot"
        ]
    },
    {
        "In the 1964 movie, what is the name of the Jack in the Box?": [
            "Charlie",
            "Sam",
            "Billy",
            "Jack"
        ]
    },
    {
        "In the 1964 movie, why did Santa Claus almost cancel Christmas?": [
            "Storm",
            "No snow",
            "No toys",
            "The Reindeer were sick"
        ]
    },
    {
        "In the 1964 movie, what animal noise did the elf make to distract the Bumble?": [
            "Oink",
            "Growl",
            "Bark",
            "Meow"
        ]
    },
    {
        "In the 1964 movie, what is the name of the prospector?": [
            "Yukon Cornelius",
            "Slider Sam",
            "Bumble",
            "Jack"
        ]
    },
    {
        "How far do reindeer travel when they migrate?": [
            "3000 miles",
            "700 miles",
            "500 miles",
            "0 miles"
        ]
    },
    {
        "How fast can a reindeer run?": [
            "48 miles per hour",
            "17 miles per hour",
            "19 miles per hour",
            "14 miles per hour"
        ]
    }
];

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
		 
//     if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.05aecccb3-1461-48fb-a008-822ddrt6b516") {
//         context.fail("Invalid Application ID");
//      }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if ("AnswerIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AnswerOnlyIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.StartOverIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.RepeatIntent" === intentName) {
        handleRepeatRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("AMAZON.StopIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else if ("AMAZON.CancelIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

// ------- Skill specific business logic -------

var ANSWER_COUNT = 4,
    GAME_LENGTH = 5;

function getWelcomeResponse(callback) {
    var sessionAttributes = {},
        cardTitle = "Reindeer Games",
        speechOutput = "Reindeer Games. I will ask you " + GAME_LENGTH.toString() 
            + " questions, try to get as many right as you can. Just say the number of the answer. Let's begin.",
        shouldEndSession = false,

        gameQuestions = populateGameQuestions(),
        correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT)), // Generate a random index for the correct answer, from 0 to 3
        roundAnswers = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex),

        currentQuestionIndex = 0,
        spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]])[0],
        repromptText = "Question 1. " + spokenQuestion + " ",

        i, j;

    for (i = 0; i < ANSWER_COUNT; i++) {
        repromptText += (i+1).toString() + ". " + roundAnswers[i] + ". "
    }
    speechOutput += repromptText;
    sessionAttributes = {
        "speechOutput": repromptText,
        "repromptText": repromptText,
        "currentQuestionIndex": currentQuestionIndex,
        "correctAnswerIndex": correctAnswerIndex + 1,
        "questions": gameQuestions,
        "score": 0,
        "correctAnswerText":
            questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]][0]
    };
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function populateGameQuestions() {
    var gameQuestions = [],
        randomNum;

    // Pick 5 random questions from the list to ask the user, make sure there are no repeats
    while (gameQuestions.length != GAME_LENGTH) {
        randomNum = Math.floor(Math.random() * (questions.length - 1));
        if (gameQuestions.indexOf(randomNum) == -1) {
            gameQuestions.push(randomNum);
        }
    }
    return gameQuestions;
}

function populateRoundAnswers(gameQuestions, index, correctAnswer) {
    // Get the answers for a given question, and place the correct answer at the spot marked by the
    // correctAnswer variable
    var answers = [],
        answersCopy = questions[gameQuestions[index]][Object.keys(questions[gameQuestions[index]])[0]],
        temp, i;
    for (i = 0; i < ANSWER_COUNT; i++) {
        answers[i] = answersCopy[i];
    }
    temp = answers[0];
    answers[0] = answers[correctAnswer];
    answers[correctAnswer] = temp;
    return answers;
}

function handleAnswerRequest(intent, session, callback) {
    var cardTitle = "Reindeer Games",
        speechOutput = "";

    var answerSlot = intent.slots.Answer;
    // If the user provided answer isn't a number > 0 and < 5,
    // return an error message to the user
    if (!answerSlot || !answerSlot.value || isNaN(parseInt(answerSlot.value))
        || !(parseInt(answerSlot.value) < ANSWER_COUNT+1 && parseInt(answerSlot.value) > 0)) {
        speechOutput = "Your answer must be a number between 1 and 4."
        callback(session.attributes,
            buildSpeechletResponse(cardTitle, speechOutput, speechOutput, false));
    }
    else {
        // If the user responded with an answer but there is no game in progress, ask the user
        // if they want to start a new game
        if (!session.attributes || !session.attributes.questions) {
            speechOutput = "There is no game in progress. To start a new game, say, " +
                "start game.";
            callback(session.attributes,
                buildSpeechletResponse(cardTitle, speechOutput, speechOutput, false));
        }
        else {
            var gameQuestions = session.attributes.questions,
                correctAnswerIndex = parseInt(session.attributes.correctAnswerIndex),
                currentScore = parseInt(session.attributes.score),
                currentQuestionIndex = parseInt(session.attributes.currentQuestionIndex),
                correctAnswerText = session.attributes.correctAnswerText;

            var speechOutputAnalysis = "";
            if (parseInt(answerSlot.value) == correctAnswerIndex) {
                currentScore++;
                speechOutputAnalysis = "correct. ";
            } else {
                speechOutputAnalysis = "wrong. The correct answer is " + correctAnswerText + ". ";
            }
            // if currentQuestionIndex is 4, we've reached 5 questions (zero-indexed) and can exit the game session
            if (currentQuestionIndex == GAME_LENGTH - 1) {
                speechOutput = "That answer is " + speechOutputAnalysis + "You got " +
                    currentScore.toString() + " out of " + GAME_LENGTH.toString() + " questions correct. Thank you for playing!";
                callback(session.attributes,
                    buildSpeechletResponse(cardTitle, speechOutput, "", true));
            }
            else {
                currentQuestionIndex += 1;
                var spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]])[0];
                // Generate a random index for the correct answer, from 0 to 3
                correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
                var roundAnswers = populateRoundAnswers(gameQuestions, currentQuestionIndex, correctAnswerIndex),

                    questionIndexForSpeech = currentQuestionIndex + 1,
                    repromptText = "Question " + questionIndexForSpeech.toString() + ". " + spokenQuestion + " ";
                for (var i = 0; i < ANSWER_COUNT; i++) {
                    repromptText += (i+1).toString() + ". " + roundAnswers[i] + ". "
                }
                speechOutput += "That answer is " + speechOutputAnalysis + "Your score is " + currentScore.toString() + ". " + repromptText;

                var sessionAttributes = {
                    "speechOutput": repromptText,
                    "repromptText": repromptText,
                    "currentQuestionIndex": currentQuestionIndex,
                    "correctAnswerIndex": correctAnswerIndex + 1,
                    "questions": gameQuestions,
                    "score": currentScore,
                    "correctAnswerText":
                        questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]][0]
                };
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));
            }
        }
    }
}

function handleRepeatRequest(intent, session, callback) {
    // Repeat the previous speechOutput and repromptText from the session attributes if available
    // else start a new game session
    if (!session.attributes || !session.attributes.speechOutput) {
        getWelcomeResponse(callback);
    } else {
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(session.attributes.speechOutput, session.attributes.repromptText, false));
    }
}

function handleGetHelpRequest(intent, session, callback) {
    // Provide a help prompt for the user, explaining how the game is played. Then, continue the game
    // if there is one in progress, or provide the option to start another one.

    // Do not edit the help dialogue. This has been created by the Alexa team to demonstrate best practices.

    var speechOutput = "I will ask you " + GAME_LENGTH.toString() + " multiple choice questions, try to get as many right as you can! "
        + "To give an answer to a question, respond with the number of the answer by saying one, two, three, or four. "
        + "To start a new game at any time, say, start game. "
        + "To repeat the last question asked, say, repeat.",
        repromptText = "To give an answer to a question, respond with the number of the answer. "
        + "To start a new game, say, start game",
        shouldEndSession = false;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
}

// ------- Helper functions to build responses -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

