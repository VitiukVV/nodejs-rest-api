const express = require("express");
const {
  validateBody,
  authenticate,
  upload,
  validateOneStringBody,
} = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post(
  "/verify",
  validateOneStringBody(schemas.verifyEmailSchema),
  ctrl.resendVerifyEmail
);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/",
  authenticate,
  validateOneStringBody(schemas.subscriptionSchema),
  ctrl.updateSubscription
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
