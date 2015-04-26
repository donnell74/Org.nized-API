/**
 * ClassBonusController
 *
 * @description :: Server-side logic for managing Classbonuses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  GetPersonsByClassBonus: function(req, res) {
    _code = req.param("course_code");
    _semester = req.param("semester");
    ClassBonus.find( { where: { course_code: _code, semester: _semester } } )
              .exec( function ( err, bonuses ) {
      if ( bonuses.length == 0 )
      {
        return res.send( bonuses ); 
      }

      bonus_id = bonuses[0].id;
      Person_ClassBonus.find( { where: { class_bonus_id: bonus_id } } )
                       .populate("email").exec( function( err, people ) {
        return res.send( people );
      });
    });
  },
  createIfNotExists: function(req, res) {
    var cbParams = req.allParams();
    delete cbParams.id;
    ClassBonus.findOrCreate(cbParams, cbParams).exec(function(err, record) {
      if (err) {
        return res.send(400, err);
      }

      return res.send(record);
    });
  },
};

