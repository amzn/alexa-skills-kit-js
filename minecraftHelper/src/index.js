/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - LITERAL slot: demonstrates literal handling for a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    recipes = require('./recipes');

var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * MinecraftHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var MinecraftHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
MinecraftHelper.prototype = Object.create(AlexaSkill.prototype);
MinecraftHelper.prototype.constructor = MinecraftHelper;

MinecraftHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechOutput = "Welcome to the Minecraft Helper. You can ask a question like, what's the recipe for a chest? ... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechOutput, repromptText);
};

MinecraftHelper.prototype.intentHandlers = {
    RecipeIntent: function (intent, session, response) {
        var itemName = intent.slots.Item.value.toLowerCase();
        var cardTitle = "Recipe for " + itemName;
        var recipe = recipes[itemName];
        if (recipe) {
            response.tellWithCard(recipe, cardTitle, recipe);
        } else {
            response.ask("I'm sorry, I currently do not know the recipe for " + itemName + ". What else can I help with?", "What else can I help with?");
        }
    },
    HelpIntent: function (intent, session, response) {
        var cardTitle = intent.name;
        var speechOutput = "You can ask questions about minecraft such as, what's the recipe for a chest, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, what's the recipe for a chest, or you can say exit... Now, what can I help you with?";
        response.ask(speechOutput, repromptText);
    }
};

exports.handler = function (event, context) {
    var minecraftHelper = new MinecraftHelper();
    minecraftHelper.execute(event, context);
};
