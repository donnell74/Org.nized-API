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
    password:
    {
      type: "string",
      required: true,
      minLength: 6
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
      type: "string",
      defaultsTo: "FALSE",
      enum: ["TRUE", "FALSE", "PENDING"], 
    },
    is_member:
    {
      type: "boolean",
      defaultsTo: false
    },
    major:
    {
      type: "string",
    },
    class_year:
    {
      type: "string",
      enum: ["FRESHMAN", "SOPHOMORE", "JUNIOR", "SENIOR"]
    },
    last_sync_date:
    {
      type: "date",
      defaultsTo: null
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
  },

  beforeCreate: function (attrs, next) {
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function(err, salt) {
      if (err) 
      {
        return next(err);
      }

      bcrypt.hash(attrs.password, salt, function(err, hash) {
        if (err) 
        {
          return next(err);
        }
        
        attrs.password = hash;
        next();
      });
    });
  }
};

