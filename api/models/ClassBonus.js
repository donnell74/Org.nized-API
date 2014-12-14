/**
* ClassBonus.js
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
      collection: "person_classbonus",
      via: "class_bonus_id",
      unique: true,
      autoIncrement: true
    }, 
    course_code:
    {
      type: "string",
      required: true
    }, 
    semester:
    {
      type: "string",
      required: true
    }
  }
};

