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

function _GetCheckins(date, cb)
{
    // static call returns date version of argument
    // without it you would get 0 epoch instead of today
    var dayOf = new Date(date);
    var dayAfter = new Date(date);
    dayAfter.setDate(dayOf.getDate() + 1);
    dayOf.setHours(0,0,0,0);
    CheckIns.find( { where: { date_scanned: { '>=': dayOf, '<': dayAfter } } })
            .populateAll()
            .exec( function (err, result) {
      cb( result ); 
    });
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
      if ( result == null )
      {
        return res.send(400, {"code": 1, "error": "Unknown user"});
      }

      if ( ! _HasCheckInForToday(result) )
      {
        CheckIns.create({email: result.email}).exec(function(err, r) {});
        
        return res.send(result);
      }

      res.send(400, {"code": 2, "error": "User has already been checked in today."});
    });
  }, 
  GetCheckInsByDate: function (req, res) {
    var date = req.param("date") || Date(null);
    _GetCheckins(date, function (data) { res.send(data); });
  },
  GetTodaysAttendance: function (req, res) {
    _GetCheckins(Date(null), function (data)
    {
      var counts = {
        "total": 0,
        "member": 0,
        "general": 0 
      };
   
      for(var i = 0; i < data.length; ++i)
      {
        counts["total"] += 1;
        if ( data[i].email.is_member == false )
        {
          counts["general"] += 1;
        } else {
          counts["member"] += 1;
        } 
      }
 
      res.send(counts);
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

