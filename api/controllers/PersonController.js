/**
 * PersonController
 *
 * @description :: Server-side logic for managing people
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function _GetFirstPerson(id, cb) {
  Person.find({ email: id }).populate('checkins').exec(function(err, persons){
    reval = null;
    if (persons.length == 0)
    {
      CardIDToEmail.find({ card_id: id }).exec(function(err, result) {
        if (result.length != 0)
        {
          Person.find({ email: result[0].email }).populate('checkins').exec( function(err, card_persons) {
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
  _GetFirstPerson: _GetFirstPerson,
};

