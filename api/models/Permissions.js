/**
* Permissions.js
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
      autoIncrement: true,
    }, 
    id:
    {
      type: "integer",
    }, 
    model:
    {
      type: "string",
      lowercase: true
    },
    self:
    {
      type: "boolean",
      defaultsTo: false
    },
    other:
    {
      type: "boolean",
      defaultsTo: false
    }
  }
};

