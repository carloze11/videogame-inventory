const Wook = require("../models/weapon");

exports.index = (req, res) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
};

// Display list of all weapons.
exports.weapon_list = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon list");
};

// Display detail page for a specific weapon.
exports.weapon_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: weapon detail: ${req.params.id}`);
};

// Display weapon create form on GET.
exports.weapon_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon create GET");
};

// Handle weapon create on POST.
exports.weapon_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon create POST");
};

// Display weapon delete form on GET.
exports.weapon_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon delete GET");
};

// Handle weapon delete on POST.
exports.weapon_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon delete POST");
};

// Display weapon update form on GET.
exports.weapon_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon update GET");
};

// Handle weapon update on POST.
exports.weapon_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon update POST");
};