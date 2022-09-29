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

router.get('/weapon/create', weapon_controller.weapon_create_get)
router.post('/weapon/create', weapon_controller.weapon_create_post)

router.get('/weapon/:id/delete', weapon_controller.weapon_delete_get)
router.post('/weapon/:id/delete', weapon_controller.weapon_delete_post)

router.get('/weapon/:id/update', weapon_controller.weapon_update_get)
router.post('/weapon/:id/update', weapon_controller.weapon_update_post)

router.get('/weapon/:id', weapon_controller.weapon_detail)

router.get('/weapons', weapon_controller.weapon_list)


// GAME ROUTES

router.get('/game/create', game_controller.game_create_get)
router.post('/game/create', game_controller.game_create_post)

router.get('/game/:id/delete', game_controller.game_delete_get)
router.post('/game/:id/delete', game_controller.game_delete_post)

router.get('/game/:id/update', game_controller.game_update_get)
router.post('/game/:id/update', game_controller.game_update_post)

router.get('/game/:id', game_controller.game_detail)

router.get('/games', game_controller.game_list)


// CATEGORY ROUTES


router.get('/category/create', category_controller.category_create_get)
router.post('/category/create', category_controller.category_create_post)

router.get('/category/:id/delete', category_controller.category_delete_get)
router.post('/category/:id/delete', category_controller.category_delete_post)

router.get('/category/:id/update', weapon_controller.category_update_get)
router.post('/category/:id/update', weapon_controller.category_update_post)

router.get('/category/:id', category_controller.category_detail)

router.get('/categories', category_controller.category_list)


// WEAPONINSTANCE ROUTES

router.get('/weaponinstance/create', weaponinstance_controller.weaponinstance_create_get)
router.post('/weaponinstance/create', weaponinstance_controller.weaponinstance_create_post)

router.get('/weaponinstance/:id/delete', weaponinstance_controller.weaponinstance_delete_get)
router.post('/weaponinstance/:id/delete', weaponinstance_controller.weaponinstance_delete_post)

router.get('/weaponinstance/:id/update', weaponinstance_controller.weaponinstance_update_get)
router.post('/weaponinstance/:id/update', weaponinstance_controller.weaponinstance_update_post)

router.get('/weaponinstance/:id', weaponinstance_controller.weaponinstance_detail)

router.get('/weaponinstances', weaponinstance_controller.weaponinstance_list)


module.exports = router;