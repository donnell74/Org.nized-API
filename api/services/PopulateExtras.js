async = require("async");

// Helper library to handle populating nested associations
var allowed_tables = {
  "possibleanswers": _PopulatePossibleAnswers, 
  "checkins": _PopulateCheckins,
  "classbonuses": _PopulateClassBonuses, 
  "roles": _PopulateRoles
};

function PopulateExtrasException(message) {
  this.message = message;
  this.name = "PopulateExtrasException";
};

function _PopulatePossibleAnswers(reval, nexts, quit) {
  // add class_bonuses
  set_to_populate = null;
  if ( typeof(reval) != "undefined" ) {
    if ( typeof(reval.possible_answers) != "undefined" && reval.possible_answers.length > 0 )
    {
      set_to_populate = reval.possible_answers;
    }

    if ( typeof(reval.questions) != "undefined" && reval.questions.length > 0 )
    {
      set_to_populate = reval.questions;
    }
  }

  if (set_to_populate != null) {
    var counter = 0;

    set_to_populate.forEach(function (element) {
      element._possible_answers = [];
      PossibleAnswers.find({where: {question_id: element.id}}).exec(function (err, possibleAnswers) {
        if ( possibleAnswers.length != 0 ) 
        {
          possibleAnswers.forEach(function (each_possible) {
              delete each_possible.createdAt;
              delete each_possible.updatedAt;
              delete each_possible.question_id;
              element._possible_answers.push(each_possible);
          });
        }
    
        counter += 1;
        if ( counter == set_to_populate.length )
        {
          if (nexts.length == 0)
          {
            quit();
          }
          else
          {
            next = nexts.pop();
            next(reval, nexts, quit);
          }
        }
      });
    });
  }
  else
  {
    if (nexts.length == 0)
    {
      quit();
    }
    else
    {
      next = nexts.pop();
      next(reval, nexts, quit);
    }
  }
};

function _PopulateCheckins(reval, nexts, quit) {
  // add checkins
  if ( typeof(reval) != "undefined" && 
       typeof(reval.checkins) != "undefined" && 
       reval.checkins.length > 0 )
  {
    reval._checkins = [];
    reval.checkins.forEach(function(element) {
      reval._checkins.push(element.date_scanned);
    });
  }

  if (nexts.length == 0)
  {
    quit();
  }
  else
  {
    next = nexts.pop();
    next(reval, nexts, quit);
  }
}


function _PopulateClassBonuses(reval, nexts, quit)
{
  // add class_bonuses
  if ( typeof(reval) != "undefined" &&
       typeof(reval.class_bonuses) != "undefined" && 
       reval.class_bonuses.length > 0 )
  {
    reval._class_bonuses = [];
    var counter = 0;
    reval.class_bonuses.forEach(function (element) {
      ClassBonus.find({where: {id: element.class_bonus_id}}).exec(function (err, bonus) {
        if ( bonus.length != 0 ) 
        {
          delete bonus[0].createdAt;
          delete bonus[0].updatedAt;
          bonus[0].class_bonus_id = element.class_bonus_id;
          reval._class_bonuses.push(bonus[0]);
        }
    
        counter += 1;
        if ( counter == reval.class_bonuses.length )
        {
          if (nexts.length == 0)
          {
            quit();
          }
          else
          {
            next = nexts.pop();
            next(reval, nexts, quit);
          }
        }
      });
    });
  }
  else
  {
    if (nexts.length == 0)
    {
      quit();
    }
    else
    {
      next = nexts.pop();
      next(reval, nexts, quit);
    }
  }
}


function _PopulateRoles(reval, nexts, quit)
{
  if ( typeof(reval) != "undefined" && 
       typeof(reval.roles) != "undefined" && 
       reval.roles.length > 0 )
  {
    reval._roles = [];
    var counter = 0;
    reval.roles.forEach(function (element) {
      Roles.find({where: {id: element.role_id}}).exec(function (err, role) {
        if (role.length != 0)
        {
          reval._roles.push(role[0].name);
        }
    
        counter += 1;
        if (counter == reval.roles.length)
        {
          if (nexts.length == 0)
          {
            quit();
          }
          else
          {
            next = nexts.pop();
            next(reval, nexts, quit);
          }
        }
      });
    });
  }
  else
  {
    if (nexts.length == 0)
    {
      quit();
    }
    else
    {
      next = nexts.pop();
      next(reval, nexts, quit);
    }
  }
}

// Wrapper function for populate call all tables
function PopulateAll(rows, cb)
{
  Populate(rows, Object.keys(allowed_tables), cb);
}


function Populate(rows, tables, cb)
{
  func_chain = [];
  if ( ! Array.isArray(rows) )
  {
    func_chain.push(cb);
  }
  
  if (Array.isArray(tables))
  {
    tables.forEach( function (element) {
      if (element in allowed_tables)
      {
        func_chain.push(allowed_tables[element]);
      }
      else
      {
        throw new PopulateExtraException(element + " is not an accepted column");
      }
    });
  }
  else
  {
    throw new PopulateExtraException("Tables is not a array");
  }

  start = func_chain.pop();
  if (Array.isArray(rows))
  {
      async.eachSeries(rows, function (each_row, callback){
        func_chain_copy = func_chain.slice(0);
        start(each_row, func_chain_copy, callback);
      }, function (err) {
        if (err)
        {
          console.log(err);
        }

        cb(rows); 
      });
  }
  else
  {
      start(rows, func_chain);
  }
}


module.exports = {
  PopulateAll: PopulateAll, 
  Populate: Populate, 
  AllowedTables: Object.keys(allowed_tables), 
};
