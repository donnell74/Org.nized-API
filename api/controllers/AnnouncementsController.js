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
  }
};

