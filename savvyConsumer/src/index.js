/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Web service: Communicate with an the Amazon associates API to get best seller information using aws-lib
 * - Dialog and Session State: Handles two models, both a one-shot ask and tell model, and a multi-turn dialog model.
 *   If the user provides an incorrect slot in a one-shot model, it will direct to the dialog model
 * - Pagination: Handles paginating a list of responses to avoid overwhelming the customer.
 *
 * Examples:
 * One-shot model
 *  User:  "Alexa, ask Savvy Consumer for top books"
 *  Alexa: "Getting the best sellers for books. The top seller for books is .... Would you like
 *          to hear more?"
 *  User:  "No"
 *
 * Dialog model:
 *  User:  "Alexa, open Savvy Consumer"
 *  Alexa: "Welcome to the Savvy Consumer. For which category do you want to hear the best sellers?"
 *  User:  "books"
 *  Alexa: "Getting the best sellers for books. The top seller for books is .... Would you like
 *          to hear more?"
 *  User:  "yes"
 *  Alexa: "Second ... Third... Fourth... Would you like to hear more?"
 *  User : "no"
 */

'use strict';
/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]"

/**
 * The key to find the current index from the session attributes
 */
var KEY_CURRENT_INDEX = "current";

/**
 * The key to find the current category from the session attributes
 */
var KEY_CURRENT_CATEGORY = "category";

/**
 * The Max number of items for Alexa to read from a request to Amazon.
 */
var MAX_ITEMS = 10;

/**
 * The number of items read for each pagination request, until we reach the MAX_ITEMS
 */
var PAGINATION_SIZE = 3;

/**
 * The AWS Access Key.
 */
var AWS_ACCESS_KEY = "Your AWS Access Key";

/**
 * The AWS Secret Key
 */
var AWS_SECRET_KEY = "Your AWS Secret Key";

/**
 * The Associates Tag
 */
var AWS_ASSOCIATES_TAG = "associates_tag";

/**
 * Helper Array that will allow a conversion from the cardinal number to the ordinal.
 */
var ARRAY_FOR_ORDINAL_SPEECH = [
    "Zero",
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth"
];

/**
 * Mapping of the browse node ID to the category for the Amazon catalog.
 */
var BROWSE_NODE_MAP = {
    Apparel: "1036592",
    Appliances: "2619526011",
    ArtsAndCrafts: "2617942011",
    Automotive: "15690151",
    Baby: "165797011",
    Beauty: "11055981",
    Books: "1000",
    Classical: "301668",
    Collectibles: "4991426011",
    DVD: "2625374011",
    DigitalMusic: "624868011",
    Electronics: "493964",
    GiftCards: "2864120011",
    GourmetFood: "16310211",
    Grocery: "16310211",
    HealthPersonalCare: "3760931",
    HomeGarden: "1063498",
    Industrial: "16310161",
    Jewelry: "2516784011",
    KindleStore: "133141011",
    Kitchen: "284507",
    LawnAndGarden: "3238155011",
    MP3Downloads: "624868011",
    Magazines: "599872",
    Miscellaneous: "10304191",
    MobileApps: "2350150011",
    Music: "301668",
    MusicalInstruments: "11965861",
    OfficeProducts: "1084128",
    OutdoorLiving: "2972638011",
    PCHardware: "541966",
    PetSupplies: "2619534011",
    Photo: "502394",
    Shoes: "672124011",
    Software: "409488",
    SportingGoods: "3375301",
    Tools: "468240",
    Toys: "165795011",
    UnboxVideo: "2858778011",
    VHS: "2625374011",
    Video: "404276",
    VideoGames: "11846801",
    Watches: "378516011",
    Wireless: "2335753011",
    WirelessAccessories: "13900851"
};

/**
 * A Mapping of alternative ways a user will say a category to how Amazon has defined the category
 */
var SPOKEN_NAME_TO_CATEGORY = {
    movies: "DVD",
    movie: "DVD",
    novels: "Books",
    novel: "Books"
};

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * Use the aws-lib
 */
var aws = require("aws-lib");

/**
 * SavvyConsumer is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var SavvyConsumer = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SavvyConsumer.prototype = Object.create(AlexaSkill.prototype);
SavvyConsumer.prototype.constructor = SavvyConsumer;

SavvyConsumer.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("SavvyConsumer onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session init logic would go here
};

SavvyConsumer.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("SavvyConsumer onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

SavvyConsumer.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("SavvyConsumer onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

SavvyConsumer.prototype.intentHandlers = {
    TopSellers: function (intent, session, response) {
        getTopSellers(intent, session, response);
    },

    HearMore: function (intent, session, response) {
        getNextPageOfItems(intent, session, response);
    },

    DontHearMore: function (intent, session, response) {
        response.tell("");
    },

    HelpIntent: function (intent, session, response) {
        helpTheUser(intent, session, response);
    }
};

/**
 * Returns the welcome response for when a user invokes this skill.
 */
function getWelcomeResponse(response) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var speechOutput = "Welcome to the Savvy Consumer. For which category do you want to hear the best sellers?";
    var repromptText = "Please choose a category by saying, "
        + "books, fashion, movie, kitchen";

    response.ask(speechOutput, repromptText);
}

/**
 * Gets the top sellers from Amazon.com for the given category and responds to the user.
 */
function getTopSellers(intent, session, response) {
    var speechOutput = "";
    var repromptText = "";

    // Check if we are in a session, and if so then reprompt for yes or no
    if (session.attributes[KEY_CURRENT_INDEX]) {
        speechOutput = "Would you like to hear more?";
        repromptText = "Would you like to hear more top sellers? Please say yes or no.";
        response.ask(speechOutput, repromptText);
        return;
    }

    var categorySlot = intent.slots.Category;

    // Find the lookup word for the given category.
    var lookupCategory = getLookupWord(categorySlot);
    // Remove the periods to fix things like d. v. d.s to dvds
    var category = categorySlot.value.replace(/\.\s*/g, '');

    if (lookupCategory) {
        // Create the the client to access the top sellers API
        var amazonCatalogClient = aws.createProdAdvClient(AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_ASSOCIATES_TAG);

        // Make the call with the proper category and browse node.
        amazonCatalogClient.call("ItemSearch", {
            SearchIndex: lookupCategory,
            BrowseNode: BROWSE_NODE_MAP[lookupCategory]
        }, function (err, result) {
            if (err) {
                // There was an error trying to fetch the top sellers from Amazon.
                console.log('An error occured', err);
                speechOutput = "I'm sorry, I cannot get the top sellers for " + category + " at this" +
                    " time. Please try again later. Goodbye.";
                response.tell(speechOutput);
                return;
            }

            // Configure the card and speech output.
            var cardTitle = "Top Sellers for " + category;
            var cardOutput = "The Top Sellers for " + category + " are: ";
            speechOutput = "Here are the top sellers for " + category + ". ";
            session.attributes[KEY_CURRENT_CATEGORY] = category;

            // Iterate through the response and set the intial response, as well as the
            // session attributes for pagination.
            var i = 0;
            for (var item in result.Items.Item) {
                var numberInList = i + 1;
                if (numberInList == 1) {
                    // Set the speech output and the current index for the first n items.
                    speechOutput = speechOutput + "The top seller is: " +
                        result.Items.Item[item].ItemAttributes.Title + ". ";
                    session.attributes[KEY_CURRENT_INDEX] = numberInList;
                }

                // Set the session attributes and full card output
                session.attributes[i] = result.Items.Item[item].ItemAttributes.Title;
                cardOutput = cardOutput + numberInList + ". " + result.Items.Item[item].ItemAttributes.Title + ".";
                i++;
            }

            if (i == 0) {
                // There were no items returned for the specified item.
                speechOutput = "I'm sorry, I cannot get the top sellers for " + category
                    + " at this time. Please try again later. Goodbye.";
                response.tell(speechOutput);
                return;
            }

            speechOutput = speechOutput + " Would you like to hear the rest?";
            repromptText = "Would you like to hear the rest? Please say yes or no.";
            response.askWithCard(speechOutput, repromptText, cardTitle, cardOutput);
            return;
        })
    } else {

        // The category didn't match one of our predefined categories. Reprompt the user.
        speechOutput = "I'm not sure what the category is, please try again";
        repromptText = "I'm not sure what the category is, you can say "
            + "books, fashion, movie, kitchen...";
        response.ask(speechOutput, repromptText);
    }
}

/**
 * Gets the next page of items based on information saved in the session.
 */
function getNextPageOfItems(intent, session, response) {
    var sessionAttributes = session.attributes;

    if (sessionAttributes[KEY_CURRENT_INDEX]) {
        var current = sessionAttributes[KEY_CURRENT_INDEX];
        var speechOutput = "";

        // Iterate through the session attributes to create the next n results for the user.
        for (var i = 0; i < PAGINATION_SIZE; i++) {
            if (sessionAttributes[current]) {
                var numberInList = current + 1;
                if (current < MAX_ITEMS - 1) {
                    speechOutput = speechOutput + ARRAY_FOR_ORDINAL_SPEECH[numberInList] + ". "
                        + sessionAttributes[current] + ". ";
                } else {
                    speechOutput = speechOutput + "And the " + ARRAY_FOR_ORDINAL_SPEECH[numberInList] + " top seller is. "
                        + sessionAttributes[current] + ". Those were the 10 top sellers in Amazon's "
                        + sessionAttributes[KEY_CURRENT_CATEGORY] + " department";
                }
                current = current + 1;
            }
        }

        // Set the new index and end the session if the newIndex is greater than the MAX_ITEMS
        sessionAttributes[KEY_CURRENT_INDEX] = current;

        if (current < MAX_ITEMS) {
            speechOutput = speechOutput + " Would you like to hear more?";
            response.ask(speechOutput, "Would you like to hear more top sellers? Please say yes or no.");
        } else {
            response.tell(speechOutput);
        }
    } else {
        // The user attempted to get more results without ever uttering the category.
        // Reprompt the user for the proper usage.
        var speechOutput = "Welcome to the Savvy Consumer. For which category do you want to hear the best sellers?.";
        var repromptText = "Please choose a category by saying, "
            + "books, fashion, movie, kitchen";
        response.ask(speechOutput, repromptText);
    }
}

/**
 * Gets the lookup word based on the input category slot. The lookup word will be from the BROWSE_NODE_MAP and will
 * attempt to get an exact match. However, if no exact match exists then the function will check for a contains.
 * @param categorySlot the input category slot
 * @returns {string} the lookup word for the BROWSE_NODE_MAP
 */
function getLookupWord(categorySlot) {
    var lookupCategory;
    if (categorySlot && categorySlot.value) {
        // Lower case the incoming slot and remove spaces
        var category = categorySlot.value.toLowerCase().replace(/ /g, '').replace(/\./g, '').replace(/three/g, '3');
        var keys = Object.keys(BROWSE_NODE_MAP);

        //Check for spoken names
        lookupCategory = SPOKEN_NAME_TO_CATEGORY[category];

        if (!lookupCategory) {
            // Iterate through the keys in the BROWSE_NODE_MAP and look for a perfect match. The items in the
            // BROWSE_NODE_MAP must be cased properly for the API call to get the top sellers.
            keys.forEach(function (item) {
                if (item.toLowerCase() === category) {
                    lookupCategory = item;
                    return;
                }
            });
        }

        if (!lookupCategory) {
            // There was no perfect match, try to see if we can perform an indexOf.
            // This will help if the user says DVDs and the actual category is DVD.
            keys.forEach(function (item) {
                if (item.toLowerCase().indexOf(category) > -1 || category.indexOf(item.toLowerCase()) > -1) {
                    lookupCategory = item;
                    return;
                }
            })
        }
    }
    return lookupCategory;
}

/**
 * Instructs the user on how to interact with this skill.
 */
function helpTheUser(intent, session, response) {
    var speechOutput = "You can ask for the best sellers on Amazon for a given category. " +
        "For example, get best sellers for books, or you can say exit. " +
        "Now, what can I help you with?";
    var repromptText = "I'm sorry I didn't understand that. You can say things like, books, movies, music. " +
        "Or you can say exit. Now, what can I help you with?";

    response.ask(speechOutput, repromptText);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var savvyConsumer = new SavvyConsumer();
    savvyConsumer.execute(event, context);
};
