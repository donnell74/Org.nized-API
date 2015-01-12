/**
 * QuestionsController
 *
 * @description :: Server-side logic for managing Questions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  findWithExtras: function (req, res) {
    Questions.find(req.params.id).populateAll().exec(function (err, rows) {
      PopulateExtras.PopulateAll(rows, function ( result ) {
        res.send(result);
      });        
    });
  }, 
};

