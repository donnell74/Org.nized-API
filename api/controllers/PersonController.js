/**
 * PersonController
 *
 * @description :: Server-side logic for managing people
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function _GetFirstPerson(id, cb) {
  Person.find({ email: id }).populate('checkins').populate('class_bonuses')
        .exec(function(err, persons){
    reval = null;
    if (persons.length == 0)
    {
      CardIDToEmail.find({ card_id: id }).exec(function(err, result) {
        if (result.length != 0)
        {
          Person.find({ email: result[0].email }).populate('checkins').populate('class_bonuses')
                .exec( function(err, card_persons) {
            if (card_persons.length != 0)
            {
              reval = card_persons[0];
            } 

            cb(reval);
          });
        }
        else
        {
          cb(reval);
        }
      });
    } else {
      reval = persons[0];
      cb(reval);
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
      return res.send(500, { error: "There is no new email field" } );
    }

    var search_values = {};

    var quit = false;
    ["old_email", "first_name", "last_name"].forEach(function(element) {
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

    if (quit)
    {
      return res.send(500, { error: "Values needed were not given" } );
    }

    Person.update(search_values).set(allowed).then( function (newProduct) {
      CardIDToEmail.update({email: search_values.email})
                   .set(allowed).then( function( newProduct ) {
      });

      return res.send(newProduct);
    });
  }, 
  _GetFirstPerson: _GetFirstPerson,
};

