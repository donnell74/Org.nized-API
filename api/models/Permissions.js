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
    role_id:
    {
      type: "integer",
      required: true
    }, 
    model:
    {
      type: "string",
      lowercase: true,
      required: true
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

