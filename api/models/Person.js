/**
* Person.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    email: 
    { 
      type: "string",
      primaryKey: true,
      required: true,
      email: true,
      unique: true
    },
    first_name:
    {
      type: "string",
      required: true
    },
    last_name:
    {
      type: "string",
      required: true
    },
    expire_date:
    {
      type: "date",
      after: new Date()
    },
    mobile_number:
    {
      type: "string"
    },
    is_local_paid:
    {
      type: "boolean",
      defaultsTo: false 
    },
    is_member:
    {
      type: "string",
      enum: ["true", "false", "pending"], 
      defaultsTo: false
    },
    major:
    {
      type: "string",
    },
    class_year:
    {
      type: "string",
      enum: ["freshman", "sophomore", "junior", "senior"]
    },
    checkins:
    {
      collection: 'checkins',
      via: 'email'
    },
    class_bonuses:
    {
      collection: 'person_classbonus',
      via: 'email'
    },
    roles:
    {
      collection: 'person_role',
      via: 'email'
    }, 
  }
};

