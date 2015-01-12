/**
* Surveys.js
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
    creator:
    {
      type: "string",
      defaultsTo: "Unknown",
    },
    name:
    {
      type: "string",
      defaultsTo: "Please add text"
    },
    start_date:
    {
      type: "date",
      defaultsTo: new Date()
    }, 
    end_date:
    {
      type: "date",
      defaultsTo: new Date()
    }, 
    questions:
    {
      collection: "questions",
      via: "survey_id"
    }, 
    roles:
    {
      collection: "surveys_roles",
      via: "survey_id"
    }
  }
};

