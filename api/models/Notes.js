/**
* Notes.js
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
    person_email:
    {
      type: "email",
      required: true,
      model: "person"
    }, 
    public_to_person:
    {
      type: "boolean",
      defaultsTo: false
    },
    title:
    {
      type: "string",
      defaultsTo: "Please add text"
    }, 
    text:
    {
      type: "string",
      defaultsTo: "Please add text"
    }, 
  }
};

