/**
 * SurveysController
 *
 * @description :: Server-side logic for managing Surveys
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  findWithExtras: function (req, res) {
    Surveys.find(req.params.id).populateAll().exec(function (err, rows) {
      PopulateExtras.PopulateAll(rows, function ( result ) {
        res.send(result);
      });        
    });
  }, 
  findCurrent: function (req, res) {
    var role_id = req.param("role_id");
    var query = Surveys.findOne({ start_date: { '<': new Date() }, end_date: { '>': new Date() } });

    query.populateAll().exec(function(err, results) {
      // now we to check the role_id
      if ( typeof(role_id) != 'undefined' ) {
        if ( typeof(results.roles) != 'undefined' ) {
          var has_id = false;
          results.roles.forEach(function(row) {
            if (row.role_id == role_id)
            {
              has_id = true;
            }
          });
       
          if ( has_id ) {
            console.log(results);
            res.send(results);
          } else {
            res.send({});
          }

        } else { 
          return res.send({});
        }
      } else {
        console.log(results);
        return res.send(results);
      }
    });
  }
};

