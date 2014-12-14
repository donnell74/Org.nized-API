/**
 * PersonController
 *
 * @description :: Server-side logic for managing people
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function _PopulateCheckins(reval, nexts) {
  // add checkins
  reval._checkins = [];
  reval.checkins.forEach(function(element) {
    reval._checkins.push(element.date_scanned);
  });

  next = nexts.pop();
  next(reval, nexts);
}


function _PopulateClassBonuses(reval, nexts)
{
  // add class_bonuses
  reval._class_bonuses = [];
  var counter = 0;
  reval.class_bonuses.forEach(function (element) {
    ClassBonus.find({where: {id: element.class_bonus_id}}).exec(function (err, bonus) {
      if ( bonus.length != 0 ) 
      {
        delete bonus[0].id;
        delete bonus[0].createdAt;
        delete bonus[0].updatedAt;
        reval._class_bonuses.push(bonus[0]);
      }
    
      counter += 1;
      if ( counter == reval.class_bonuses.length )
      {
        next = nexts.pop();
        next(reval, nexts);
      }
    });
  });

}


function _PopulateRoles(reval, nexts)
{
  reval._roles = [];
  var counter = 0;
  reval.roles.forEach(function (element) {
    Roles.find({where: {id: element.role_id}}).exec(function (err, role) {
      if (role.length != 0)
      {
        reval._roles.push(role[0].name);
      }
    
      counter += 1;
      if (counter == reval.roles.length)
      {
        next = nexts.pop();
        next(reval, nexts);
      }
    });
  });
}


function _PopulateExtras(reval, cb)
{
  // cb must be first element
  func_chain = [cb,
                _PopulateClassBonuses,
                _PopulateRoles];

  _PopulateCheckins(reval, func_chain); 
}


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
            if (card_persons.length != 0)
            {
              reval = card_persons[0];
            } 

            _PopulateExtras(reval, cb);
          });
        }
        else
        {
          cb(reval);
        }
      });
    } else {
      reval = persons[0];
      _PopulateExtras(reval, cb);
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
  _GetFirstPerson: _GetFirstPerson,
};

