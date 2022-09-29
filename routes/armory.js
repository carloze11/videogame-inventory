const express = require('express')
const router = express.Router();


//Require controller modules
const weapon_controller = require('../controllers/weaponController');
const game_controller = require('../controllers/gameController')
const category_controller = require('../controllers/categoryController')
const weaponinstance_controller = require('../controllers/weaponinstanceController')


//Weapon routes

//Home page route
router.get('/', weapon_controller.index)



module.exports = router;