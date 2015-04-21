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

    JSON.parse(ids).forEach(function (each_id) {
      Person_ClassBonus.destroy({class_bonus_id: each_id}).exec(function(err) {
	console.log("deleted class bonus with id: ", each_id);
      });
    });

    return res.send(true);
  }
};

