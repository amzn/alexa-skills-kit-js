/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Multiple slots: has 2 slots (name and score)
 * - Database Interaction: demonstrates how to read and write data to DynamoDB.
 * - NUMBER slot: demonstrates how to handle number slots.
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 * - Dialog and Session state: Handles two models, both a one-shot ask and tell model, and a multi-turn dialog model.
 *   If the user provides an incorrect slot in a one-shot model, it will direct to the dialog model. See the
 *   examples section for sample interactions of these models.
 *
 * Examples:
 * Dialog model:
 *  User: "Alexa, tell score keeper to reset."
 *  Alexa: "New game started without players. Who do you want to add first?"
 *  User: "Add the player Bob"
 *  Alexa: "Bob has joined your game"
 *  User: "Add player Jeff"
 *  Alexa: "Jeff has joined your game"
 *
 *  (skill saves the new game and ends)
 *
 *  User: "Alexa, tell score keeper to give Bob three points."
 *  Alexa: "Updating your score, three points for Bob"
 *
 *  (skill saves the latest score and ends)
 *
 * One-shot model:
 *  User: "Alexa, what's the current score?"
 *  Alexa: "Jeff has zero points and Bob has three"
 */
'use strict';
var ScoreKeeper = require('./scoreKeeper');

exports.handler = function (event, context) {
    var scoreKeeper = new ScoreKeeper();
    scoreKeeper.execute(event, context);
};
