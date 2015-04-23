/**
 * Person_ClassBonusController
 *
 * @description :: Server-side logic for managing Person_classbonuses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  Delete: function (req, res) {
    var ids = req.param("class_bonus_ids");
    if ( ids == null ) {
      return res.send(400);
    }

    console.log(JSON.parse(ids));
    JSON.parse(ids).forEach(function (each_id) {
      Person_ClassBonus.destroy({class_bonus_id: each_id}).exec(function(err) {
	console.log("deleted class bonus with id: ", each_id);
      });
    });

    return res.send(ids);
  },
  createIfNotExists: function(req, res) {
    var cbParams = req.allParams();
    delete cbParams.id;
    Person_ClassBonus.findOrCreate(cbParams, cbParams).exec(function(err, record) {
      if ( err ) {
        return res.send(400, err);
      }
 
      return res.send(record);
    });
  },
};

