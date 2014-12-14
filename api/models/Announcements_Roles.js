/**
* Announcements_Roles.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    announcement_id:
    {
      type: "integer",
      primaryKey: true,
      required: true,
      model: 'announcements'
    },
    role_id:
    {
      type: "integer",
      required: true,
      model: 'roles'
    }
  }
};

