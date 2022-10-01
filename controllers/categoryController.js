const Category = require("../models/category");
const Weapon = require("../models/weapon")
const async = require("async")
const { body, validationResult } = require("express-validator");

// Display list of all categories.
exports.category_list = (req, res, next) => {
  Category.find({}, "type")
    .exec((err, list_category) => {
      if (err){
        return next(err)
      }
      res.render("category_list", {
        title: "Weapon Categories",
        category_list: list_category,
      })
    })
};

// Display detail page for a specific category.
exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback)
      },
      category_weapons(callback){
        Weapon.find({category: req.params.id }).exec(callback)
      },
    },
    (err, results) => {
      if (err) {
        return next(err)
      }
      if (results.category == null) {
        const err = new Error("Category not found.")
        err.status = 404;
        return next(err)
      }
      res.render("category_detail", {
        title: "Category Details",
        category: results.category,
        category_weapons: results.category_weapons,
      })
    }
  )
};

// Display category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", {
    title: "Create New Category"
  })
};

// Handle category create on POST.
exports.category_create_post = [
  body("type", "Type required.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description required.").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    const category = new Category({ type: req.body.type, description: req.body.description })

    if (!errors.isEmpty()){
      res.render("category_form", {
        title: "Create New Category",
        category,
        errors: errors.array(),
      })
      return;
    }
    Category.findOne({ type: req.body.type }).exec((err, found_category) => {
      if (err) {
        return next(err)
      }
      if (found_category) {
        res.redirect(found_category.url)
      }
      category.save((err) => {
        if (err) {
          return next(err)
        }
        res.redirect(category.url)
      })
    })
  }
]

// Display category delete form on GET.
exports.category_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category delete GET");
};

// Handle category delete on POST.
exports.category_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category delete POST");
};

// Display category update form on GET.
exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category update GET");
};

// Handle category update on POST.
exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category update POST");
};