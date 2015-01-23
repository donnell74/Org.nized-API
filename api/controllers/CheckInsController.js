/**
 * CheckInsController
 *
 * @description :: Server-side logic for managing Checkins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

function _HasCheckInForToday(person)
{
  reval = false;

  var nowDate = new Date();
  nowDate = nowDate.toDateString();
  
  person.checkins.forEach(function (eachCheckIn) {
     var checkInDate = new Date(eachCheckIn.date_scanned).toDateString();
     if ( nowDate == checkInDate )
     {
       reval = true;
     }
  });

  return reval;
}


module.exports = {
  CheckIfUserCheckedInToday: function(req, res) {
    sails.controllers.person._GetFirstPerson(req.params.id, function (result) {
      if ( result == null )
      {
        return res.send(false);
      }

      res.send(_HasCheckInForToday(result));
    });
  },
  CheckInPerson: function (req, res) {
    sails.controllers.person._GetFirstPerson(req.param("card_id"), function (result) {
      console.log("Person: ", result);
      if ( result == null )
      {
        return res.send(false);
      }

      if ( ! _HasCheckInForToday(result) )
      {
        CheckIns.create({email: result.email}).exec(function(err, r) {});
        
        return res.send(result);
      }

      res.send(false);
    });
  }, 
  GetCheckInsByDate: function (req, res) {
    var dayOf = new Date(req.params.id);
    var dayAfter = new Date(req.params.id);
    dayAfter.setDate(dayOf.getDate() + 1);
    CheckIns.find( { where: { date_scanned: { '>=': dayOf, '<': dayAfter } } })
            .exec( function (err, result) {
      res.send( result ); 
    });
  },
  GetTotalCheckInsByDate: function (req, res) {
    var dayOf = new Date(req.params.id);
    var dayAfter = new Date(req.params.id);
    dayAfter.setDate(dayOf.getDate() + 1);
    CheckIns.count( { where: { date_scanned: { '>=': dayOf, '<': dayAfter } } })
            .exec( function (err, result) {
      res.send( { 'count': result } );
    });
  },
};

