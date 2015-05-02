/**
 * CardIDToEmailController
 *
 * @description :: Server-side logic for managing Cardidtoemails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  findOrCreate: function (req, res) {
    var _card_id = req.param("card_id");
    var _email = req.param("email");
    if ( ! _card_id || ! _email ) {
      res.send(400, "card_id and email are required");
    }
    DomainShortcuts.Replace(_email,
    function(newEmail) {
      CardIDToEmail.find(_card_id).exec(function(err, data) { 
        if (data.length == 0)
        {
          CardIDToEmail.create({ card_id: _card_id, email: newEmail })
                       .exec(function(err, result) {
            res.send(result);
          });
        } else {
          res.send(data[0]);
        }
      });
    });
  },
  destroy: function (req, res) {
    var _card_id = req.param("card_id");
    if ( ! _card_id ) {
      res.send(400, "card_id is required");
    }

    CardIDToEmail.destroy( {card_id: _card_id} ).exec( function (err, data) {
      console.log("Deleted card_id " + _card_id);
      res.send(null);
    });
  },
};

