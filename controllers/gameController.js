const Game = require("../models/game");
const Weapon = require("../models/weapon");
const async = require("async")

// Display list of all games.
exports.game_list = (req, res, next) => {
  Game.find({}, "title dev release_date")
    .sort({title: 1})
    .exec((err, list_games) => {
      if (err) {
        return next(err)
      }
      res.render("game_list", {
        title: "Games List",
        game_list: list_games,
      })
    })
};

// Display detail page for a specific game.
exports.game_detail = (req, res, next) => {
  async.parallel(
    {
      game(callback){
        Game.findById(req.params.id).exec(callback)
      },
      game_weapons(callback){
        Weapon.find({ game: req.params.id }).exec(callback)
      },
    },
    (err, results) => {
      if (err){
        return next(err)
      }
      if (results.game == null){
        err = new Error("Game doesn't exist.")
        err.status = 404
        return next(err)
      }
      res.render("game_detail", {
        title: "Game Details",
        game: results.game,
        game_weapons: results.game_weapons,
      })
    }
  )
};

// Display game create form on GET.
exports.game_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: game create GET");
};

// Handle game create on POST.
exports.game_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: game create POST");
};

// Display game delete form on GET.
exports.game_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: game delete GET");
};

// Handle game delete on POST.
exports.game_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: game delete POST");
};

// Display game update form on GET.
exports.game_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: game update GET");
};

// Handle game update on POST.
exports.game_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: game update POST");
};