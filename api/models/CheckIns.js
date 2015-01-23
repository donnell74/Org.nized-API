/**
* CheckIns.js
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
    email:
    {
      type: 'string',
      required: true,
      primaryKey: true,
      email: true,
      model: 'person'
    }, 
    date_scanned:
    {
      type: "datetime",
      defaultsTo: function () { return new Date(); } 
    }
  }
};

