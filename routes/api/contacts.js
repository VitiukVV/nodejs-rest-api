const express = require("express");
const ctrl = require("../../controllers/contacts");
const {
  validateBody,
  isValidId,
  validateOneStringBody,
  authenticate,
} = require("../../middlewares");
const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.getAll);

router.get("/:contactId", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, validateBody(schemas.validateData), ctrl.add);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.validateData),
  ctrl.updateById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateOneStringBody(schemas.updateFavorite),
  ctrl.updateFavoriteById
);

router.delete("/:contactId", authenticate, isValidId, ctrl.deleteById);

module.exports = router;
