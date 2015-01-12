/**
* Questions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    id:
    {
      type: "integer",
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    survey_id:
    {
      type: "integer",
      required: true,
    },
    question_text:
    {
      type: "string",
      required: true,
    },
    type:
    {
      enum: ["TEXT", "CHECKBOX", "RADIO"], 
      required: true
    }, 
    possible_answers:
    {
      collection: "possibleanswers",
      via: "question_id"
    },
    roles:
    {
      collection: "questions_roles",
      via: "question_id", 
    }, 
  }
};

