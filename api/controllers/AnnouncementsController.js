/**
 * AnnouncementsController
 *
 * @description :: Server-side logic for managing Announcements
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  findWithExtras: function (req, res)
  {
    Announcements.find(req.params.id).populateAll().exec(function (err, rows) {
      PopulateExtras.PopulateAll(rows, function ( result ) {
        res.send(result);
      });        
    });
  },
  findCurrent: function (req, res)
  {
    var role_id = req.param("role_id");
    var query = Announcements.find({ start_date: { '<': new Date() }, end_date: { '>': new Date() } });

    query.populateAll().exec(function(err, results) {
      // now we to check the role_id
      var reval = [];
      if ( typeof(role_id) != 'undefined' ) {
        results.forEach(function(row) {
          if ( typeof(row.roles) != 'undefined' ) {
            var has_id = false;
            row.roles.forEach(function(each_role) {
              if (each_role.role_id == role_id)
              {
                has_id = true;
              }
            });
       
            if ( has_id ) {
              delete row.roles;
              reval.push(row);
            }
          }
        });

        console.log(reval);
        return res.send(reval);
      } else {
        results.forEach(function(row) {
          delete row.roles;
          reval.push(row);
        });

        return res.send(reval);
      }
    });
  }
};

