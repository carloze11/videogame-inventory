const WeaponInstance = require("../models/weaponinstance");
const Weapon = require("../models/weapon")
const async = require("async")

// Display list of all weaponInstances.
exports.weaponinstance_list = (req, res, next) => {
  WeaponInstance.find()
    .populate("weapon")
    .exec((err, list_weaponinstances) => {
      if (err) {
        return next(err)
      }
      res.render("weaponinstance_list", {
        title: "Weapon Nicknames",
        weaponinstance_list: list_weaponinstances,
      })
    });

};

// Display detail page for a specific weaponInstance.
exports.weaponinstance_detail = (req, res, next) => {
  async.parallel(
    {
      weaponinstance(callback){
        WeaponInstance.findById(req.params.id)
          .populate("weapon")
          .exec(callback)
      },
    },
    (err, results) => {
      if (err){
        return next(err)
      }
      if (results.weaponinstance == null){
        err = new Error("There are no weapon instances.")
        err.status = 404
        return next(err)
      }
      res.render("weaponinstance_detail", {
        title: "Weapon Instance Details", 
        weaponinstance: results.weaponinstance,
      })
    }
    
  )
};

// Display weaponInstance create form on GET.
exports.weaponinstance_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: weaponInstance create GET");
};

// Handle weaponInstance create on POST.
exports.weaponinstance_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: weaponInstance create POST");
};

// Display weaponInstance delete form on GET.
exports.weaponinstance_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: weaponInstance delete GET");
};

// Handle weaponInstance delete on POST.
exports.weaponinstance_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: weaponInstance delete POST");
};

// Display weaponInstance update form on GET.
exports.weaponinstance_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: weaponInstance update GET");
};

// Handle weaponinstance update on POST.
exports.weaponinstance_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: weaponInstance update POST");
};