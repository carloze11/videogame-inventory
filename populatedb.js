#! /usr/bin/env node

console.log('This script populates some test weapons, games, categories and WeaponInstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Weapon = require('./models/weapon')
var Game = require('./models/game')
var Category = require('./models/category')
var WeaponInstance = require('./models/weaponinstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var games = []
var categories = []
var weapons = []
var weaponinstances = []

function gameCreate(title, dev, description, release_date, cb) {
  gamedetail = {title:title , dev: dev, description: description, release_date: release_date }
  
  var game = new Game(gamedetail);
       
  game.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Game: ' + game);
    games.push(game)
    cb(null, game)
  }  );
}

function categoryCreate(type, description, cb) {
  var category = new Category({ type: type, description: description });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function weaponCreate(name, description, game, category, tier, cb) {
  weapondetail = { 
    name: name,
    description: description,
    game: game,
    category: category,
    tier: tier,
  }
  if (category != false) weapondetail.category = category
    
  var weapon = new Weapon(weapondetail);    
  weapon.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Weapon: ' + weapon);
    weapons.push(weapon)
    cb(null, weapon)
  }  );
}


function weaponInstanceCreate(weapon, nickname, cb) {
  weaponinstancedetail = { 
    weapon: weapon,
    nickname: nickname,
  }    
    
  var weaponinstance = new WeaponInstance(weaponinstancedetail);    
  weaponinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING WeaponInstance: ' + weaponinstance);
      cb(err, null)
      return
    }
    console.log('New WeaponInstance: ' + weaponinstance);
    weaponinstances.push(weaponinstance)
    cb(null, weapon)
  }  );
}


function createCategoryGames(cb) {
    async.series([
        function(callback) {
          gameCreate('Halo: Combat Evolved', 'Bungie', 'Halo is set in the twenty-sixth century, with the player assuming the role of the Master Chief, a cybernetically enhanced supersoldier. The Chief is accompanied by Cortana, an artificial intelligence. Players battle aliens as they attempt to uncover the secrets of the eponymous Halo, a ring-shaped artificial world.', '2001-11-15', callback);
        },
        function(callback) {
          gameCreate('Halo 2', 'Bungie', `Halo 2 is the second installment in the Halo franchise and the sequel to 2001's critically acclaimed Halo: Combat Evolved. The game features new weapons, enemies, and vehicles, and shipped with online multiplayer via Microsoft's Xbox Live service. In Halo 2's story mode, the player assumes the roles of the human Master Chief and alien Arbiter in a 26th-century conflict between the United Nations Space Command, the genocidal Covenant, and the parasitic Flood.`, '2004-11-9', callback);
        },
        function(callback) {
          gameCreate('Halo 3', 'Bungie', `The third installment in the Halo franchise, the game concludes the story arc begun in 2001's Halo: Combat Evolved and continued in 2004's Halo 2. Halo 3's story centers on the interstellar war between twenty-sixth century humanity, a collection of alien races known as the Covenant, and the alien parasite Flood. The player assumes the role of the Master Chief, a cybernetically enhanced supersoldier, as he battles the Covenant and the Flood.`, '2007-09-25', callback);
        },
        function(callback) {
          gameCreate('Halo 4', '343 Industries', `Halo 4's story follows a cybernetically enhanced human supersoldier, Master Chief, and his artificial intelligence construct Cortana, as they encounter unknown threats while exploring an ancient civilization's planet. The player assumes the role of Master Chief who battles against a new faction that splintered off from remnants of the Covenant, a former military alliance of alien races, and against mechanical warriors of the Forerunner empire known as the Prometheans.`, '2012-11-6', callback);
        },
        function(callback) {
          gameCreate('Halo 5: Guardians', '343 Industries', `The plot follows two fireteams of human supersoldiers: Blue Team, led by Master Chief, and Fireteam Osiris, led by Spartan Locke. When the former goes absent without leave to track down the artificial intelligence construct Cortana, Master Chief's loyalty is called into question and Fireteam Osiris is sent to retrieve him.`, '2015-10-27', callback);
        },
        function(callback) {
          categoryCreate("Assualt Rifle", `An Assault Rifle is a select-fire weapon that fires an intermediate rifle cartridge and uses a projectile with a muzzle energy between those of a full-sized rifle and a smaller submachine gun or pistol. Assault rifles are categorized between battle rifles, which fire a full-sized rifle cartridge, and submachine guns, which fire a pistol cartridge rather than the more powerful rifle cartridge.`, callback);
        },
        function(callback) {
          categoryCreate("Submachine Gun", `A lightweight automatic small-arms weapon chambered for relatively low-energy pistol cartridges and fired from the hip or shoulder. Most types utilize simple blowback actions.`, callback);
        },
        function(callback) {
          categoryCreate("Sniper", `A sniper is an infantry specialist equipped with a high-precision weapon, typically a sniper rifle. Snipers engage targets from concealed positions or distances exceeding the detection capabilities of enemy personnel.`, callback);
        },
        ],
        // optional callback
        cb);
}


function createWeapons(cb) {
    async.parallel([
        function(callback) {
          weaponCreate('MA5B', `The MA5B Individual Combat Weapon System (MA5B ICWS or MA5B assault rifle) is a standard-issue service rifle of the UNSC Marines.`, games[0], [categories[0],], 'Mid', callback);
        },
        function(callback) {
          weaponCreate('MA5B', `The MA5B Individual Combat Weapon System (MA5B ICWS or MA5B assault rifle) is a standard-issue service rifle of the UNSC Marines.`, games[0], [categories[0],], 'Mid', callback);
        },
        function(callback) {
          weaponCreate('MA5B', `The MA5B Individual Combat Weapon System (MA5B ICWS or MA5B assault rifle) is a standard-issue service rifle of the UNSC Marines.`, games[0], [categories[0],], 'Mid', callback);
        },
        function(callback) {
            weaponCreate('MA5B', `The MA5B Individual Combat Weapon System (MA5B ICWS or MA5B assault rifle) is a standard-issue service rifle of the UNSC Marines.`, games[1], [categories[0],], 'Mid', callback);
        },
        function(callback) {
            weaponCreate('MA5B', `The MA5B Individual Combat Weapon System (MA5B ICWS or MA5B assault rifle) is a standard-issue service rifle of the UNSC Marines.`, games[1], [categories[0],], 'Mid', callback);
        },
        function(callback) {
            weaponCreate('MA5B', `The MA5B Individual Combat Weapon System (MA5B ICWS or MA5B assault rifle) is a standard-issue service rifle of the UNSC Marines.`, games[2], [categories[0],], 'Mid', callback);
        },
        function(callback) {
            weaponCreate('MA5B', `The MA5B Individual Combat Weapon System (MA5B ICWS or MA5B assault rifle) is a standard-issue service rifle of the UNSC Marines.`, games[3], [categories[0],], 'Mid', callback);
        }
        ],
        // optional callback
        cb);
}


function createWeaponInstances(cb) {
    async.parallel([
        function(callback) {
          weaponInstanceCreate(weapons[0], 'Starter Gun', callback)
        },
        function(callback) {
            weaponInstanceCreate(weapons[0], 'Starter Gun', callback)
        },
        function(callback) {
            weaponInstanceCreate(weapons[0], 'Starter Gun', callback)
        },
        function(callback) {
            weaponInstanceCreate(weapons[0], 'Starter Gun', callback)
        },
        function(callback) {
            weaponInstanceCreate(weapons[0], 'Starter Gun', callback)
        },
        function(callback) {
            weaponInstanceCreate(weapons[0], 'Starter Gun', callback)
        },
        function(callback) {
            weaponInstanceCreate(weapons[0], 'Starter Gun', callback)
        },
        function(callback) {
            weaponInstanceCreate(weapons[0], 'Starter Gun', callback)
        },
        function(callback) {
            weaponInstanceCreate(weapons[0], 'Starter Gun', callback)
        },
        function(callback) {
            weaponInstanceCreate(weapons[0], 'Starter Gun', callback)
        },
        function(callback) {
            weaponInstanceCreate(weapons[0], 'Starter Gun', callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createCategoryGames,
    createWeapons,
    createWeaponInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('WeaponInstances: '+ weaponinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



