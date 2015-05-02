var async = require("async");

var domainShortcuts = {
  "@msu": "@live.missouristate.edu",
  "@_msu": "@missouristate.edu"
};

module.exports = {
Replace: function(email, callBack) {
  if ( ! email || typeof email == 'undefined') {
    return callBack(email);
  }

  async.each(
    Object.keys(domainShortcuts),
    function(key, callb) {
      email = email.replace(new RegExp(key, "gi"), domainShortcuts[key]);
      console.log(email);
      callb();
    },
    function(err) {
      if (err) {
        return res.send(500, {"error": err});
      }
      callBack(email);
    }
  );
}
};
