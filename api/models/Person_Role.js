/**
* Person_Role.js
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
      type: "string",
      required: true,
      email: true, 
      model: 'person'
    },
    role_id:
    {
      type: "integer",
      required: true,
      model: 'roles'
    }

  }
};

