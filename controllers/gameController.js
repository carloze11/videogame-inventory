const Game = require("../models/game");
const Weapon = require("../models/weapon");
const async = require("async")
const { body, validationResult } = require("express-validator");
const game = require("../models/game");

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
  res.render("game_form", {
    title: "Enter a New Game",
  })
};

// Handle game create on POST.
exports.game_create_post = [
  body("title", "Title must not be empty.").trim().isLength({ min: 1}).escape(),
  body("dev", "Somebody must have made the game!").trim().isLength({ min: 1}).escape(),
  body("description", "I wanna know about the game!").trim().isLength({ min: 1}).escape(),
  body("release_date", "When did it come out?").optional({ checkFalsy: true }).isISO8601().toDate(),

  (req, res,next) => {
    const errors = validationResult(req)
    const game = new Game({
      title: req.body.title, 
      dev: req.body.dev, 
      description: req.body.description, 
      release_date: req.body.release_date,
    })

    if (!errors.isEmpty()){
      return next(err)
    }

    Game.findOne({title: req.body.title}).exec((err, found_game) => {
      if (err) {
        return next(err)
      }
      if (found_game) {
        res.redirect(found_game.url)
      }
      game.save(err => {
        if (err){
          return next(err)
        }
        res.redirect(game.url)
      })
    })
  }
]

// Display game delete form on GET.
exports.game_delete_get = (req, res, next) => {
  async.parallel(
    {
      game(callback){
        Game.findById(req.params.id).exec(callback)
      },
      weapons(callback){
        Weapon.find({game: req.params.id}).exec(callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err)
      }
      if (results.game == null){
        res.redirect("/armory/games")
      }

      res.render("game_delete", {
        title: "Delete Game",
        game: results.game,
        weapons: results.weapons,
      })
    }
  )
};

// Handle game delete on POST.
exports.game_delete_post = (req, res, next) => {
  async.parallel(
    {
      game(callback){
        Game.findById(req.body.id).exec(callback)
      },
      weapons(callback){
        Weapon.find({game: req.body.id}).exec(callback)
      }
    },

    (err, results) => {
      if (err){
        return next(err)
      }
      if (results.weapons.length > 0) {
        res.render("game_delete", {
          title: "Delete Author",
          game: results.game,
          weapons: results.weapons
        })
        return;
      }
      Game.findByIdAndRemove(req.body.gameid, (err) => {
        if (err) {
          return next(err)
        }
        res.redirect("/armory/games")
      })
    }


  )
};

// Display game update form on GET.
exports.game_update_get = (req, res, next) => {
  async.parallel(
    {
      game(callback){
        Game.findById(req.params.id).exec(callback)
      },
      weapons(callback){
        Weapon.find({game: req.params.id}).exec(callback)
      }
    },
    (err, results) => {
      if (err){
        return next(err)
      }
      if (results.game == null) {
        err = new Error("Game not found.")
        err.status = 404
        return next(err)
      }
      res.render("game_form", {
        title: "Update Game",
        game: results.game,
      })
    }
  )
};

// Handle game update on POST.
exports.game_update_post = [
  body("title", "Title must not be empty.").trim().isLength({ min: 1}).escape(),
  body("dev", "Somebody must have made the game!").trim().isLength({ min: 1}).escape(),
  body("description", "I wanna know about the game!").trim().isLength({ min: 1}).escape(),
  body("release_date", "When did it come out?").optional({ checkFalsy: true }).isISO8601().toDate(),

  (req, res,next) => {
    const errors = validationResult(req)
    const game = new Game({
      title: req.body.title, 
      dev: req.body.dev, 
      description: req.body.description, 
      release_date: req.body.release_date,
      _id: req.params.id,
    })

    if (!errors.isEmpty()){
      async.parallel(
        {
          game(callback){
            Game.findById(req.params.id).exec(callback)
          },
          weapons(callback){
            Weapon.find({game: req.params.id}).exec(callback)
          }
        },
        (err, results) => {
          if (err){
            return next(err)
          }
          if (results.game == null) {
            err = new Error("Game not found.")
            err.status = 404
            return next(err)
          }
          res.render("game_form", {
            title: "Update Game",
            game: results.game,
            errors: errors.array(),
          })
        }
      )
      return
    }

    Game.findOneAndUpdate(req.params.id, game, {}, (err, thegame) => {
      if (err){
        return next(err)
      }
      res.redirect(thegame.url)
    })
  }
]