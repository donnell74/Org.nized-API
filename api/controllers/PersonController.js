/**
 * PersonController
 *
 * @description :: Server-side logic for managing people
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcrypt');

function _GetFirstPerson(id, cb) {
  Person.find({ email: id }).populateAll()
        .exec(function(err, persons){
    reval = null;
    if (persons.length == 0)
    {
      CardIDToEmail.find({ card_id: id }).exec(function(err, result) {
        if (result.length != 0)
        {
          Person.find({ email: result[0].email }).populateAll()
                .exec( function(err, card_persons) {
            console.log(card_persons);
            if (card_persons.length != 0)
            {
              reval = card_persons[0];
              delete reval.password;
              PopulateExtras.PopulateAll(reval, cb);
            } 
            else
            {
              cb(reval);
            }
          });
        }
        else
        {
          cb(reval);
        }
      });
    } else {
      reval = persons[0];
      delete reval.password;
      PopulateExtras.PopulateAll(reval, cb);
    }
  });
}

function get_search_values(values, search_attr)
{
    var search_values = {quit: false};
    search_attr.forEach(function(element) {
      if (element in values)
      {
        if (element != "old_email")
        {
          search_values[element] = values[element];
        }
        else
        {
          search_values["email"] = values[element];
        }
      }
      else
      {
        quit = true;
      }
    });
}

function login (req, res) {
  console.log("Login for: ", req.body.email); 
  Person.findOneByEmail(req.body.email).exec(function (err, person) {
    if (err)
    {
      return res.send(500, { error: "Database error for login" });
    }

    if (person)
    {
      if ( req.body.password == person.password ) {
        req.session.person = person.id;
        delete person.password;
        res.send(person);
      }
      else
      {
        if (req.session.person)
        {
          req.session.person = null;
        }

        res.send(400, { error: "Invalid password" });
      }
    }
    else
    {
      res.send(404, { error: "Person not found" });
    }

  });
};

module.exports = {
  CheckIfUserExist: function (req, res) {
    _GetFirstPerson(req.params.id, function (result) { 
      res.send( result != null ); 
    });
  },
  GetFirstPerson: function (req, res) {
    _GetFirstPerson(req.params.id, function (result) {
      res.send( result );
    });
  },
  GetClassBonusesByPerson: function (req, res) {
    _GetFirstPerson(req.params.id, function (result) {
      if ( result != null && result.length != 0 )
      {
        count = 0;
        result.class_bonuses.forEach(function (bonus) {
          ClassBonus.find(bonus.class_bonus_id).limit(1).exec(function(err, this_classbonus) {    
            if (this_classbonus.length != 0)
            {
              bonus.course_code = this_classbonus[0].course_code;
            }

            count += 1;
            if (count == result.class_bonuses.length)
            {
              return res.send(result);
            }
          });
        });
      }
      else
      {
        res.send( result ); 
      }
    });
  }, 
  UpdateEmail: function (req, res) {
    var values = req.allParams();
    
    // Don't allow these values
    if ( "new_email" in values )
    {
      var allowed = {email: values.new_email};
    }
    else
    {
      return res.send(400, { error: "There is no new email field" } );
    }

    search_values = get_search_values(values, ["old_email", "first_name", "last_name"]);

    if (search_values.quit)
    {
      return res.send(400, { error: "Values needed were not given" } );
    }
    else
    {
      delete search_values.quit;
    }

    Person.update(search_values).set(allowed).then( function (newProduct) {
      CardIDToEmail.update({email: search_values.email})
                   .set(allowed).then( function( newProduct ) {
      });

      return res.send(newProduct);
    });
  }, 
  InsertPerson: function (req, res) {
    var values = req.allParams();
    delete values.id;
 
    if ("email" in values)
    {
      if (! "first_name" in values)
      {
        return res.send(400, { error: "First name not given" } );
      }

      if (! "last_name" in values)
      {
        return res.send(400, {error: "Last name not given" } );
      }

      var search_query = {first_name: values.first_name, last_name: values.last_name}; 

      Person.find({ where: search_query }).exec(function (err, persons) {
        if ( persons.length == 0 )
        {
          Person.create(values).exec(function (err, newPerson) {
            return res.send(newPerson); 
          });
        }
        else
        {
          // Make the update query for the user
          values.old_email = persons[0].email;
          values.new_email = values.email;
          delete values.email;

          return res.send(409, { error: "PossibleDuplicatePerson", query: values } )
        }
      });
    }
    else
    {
      return res.send(400, { error: "Email not given" } );
    }
  }, 
  DeletePerson: function (req, res) {
    _GetFirstPerson(req.params.id, function (result) {
      if (reval == null)
      {
        return res.send(400, { error: "Could not find user" } );
      }
    
      Person.destroy({email: result.email}).exec(function (err) {
        CardIDToEmail.destroy({email: result.email}).exec( function (err) {
            console.log("Email " + result.email + " has been deleted.");
            return res.send(result);
        });
      });
    });
  },
  find: function (req, res) {
    Person.find(req.params.id).populateAll().exec(function (err, rows) {
      PopulateExtras.PopulateAll(rows, function ( result ) {
        res.send(result);
      });        
    });
  }, 
  _GetFirstPerson: _GetFirstPerson,
  login: login,
  resetPassword: function (req, res) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) 
      {
        res.send(500, err);
      }

      bcrypt.hash("Aitp2015", salt, function(err, hash) {
        if (err) 
        {
          res.send(500, err);
        }
        
        Person.update({email: req.params.id}).set({password: hash}).exec(function (err, newPerson) {
          if (err)
          {
            res.send(500, err);
          }
          else
          {
            res.send(newPerson);
          }
        });
      });

    });
  }, 
};

