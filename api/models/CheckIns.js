/**
* CheckIns.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    email:
    {
      model: 'person',
      type: 'string',
      required: true,
      primaryKey: true,
      email: true
    }, 
    date_scanned:
    {
      type: "datetime",
      defaultsTo: function () { return new Date(); } 
    }
  }
};

