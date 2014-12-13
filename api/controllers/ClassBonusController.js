/**
 * ClassBonusController
 *
 * @description :: Server-side logic for managing Classbonuses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  GetPersonsByClassBonus: function(req, res) {
    var nowDate = new Date();
    var nowSemester = "";
    if ( nowDate.month < 6 )
    {
      nowSemester += "SP";
    }
    else if ( nowDate.month < 8 )
    {
      nowSemester += "SU";
    }
    else
    {
      nowSemester += "FA";
    }

    nowSemester += nowDate.getFullYear();

    code = req.params.id;
    ClassBonus.find( { where: { course_code: code, semester: nowSemester } } )
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
};

