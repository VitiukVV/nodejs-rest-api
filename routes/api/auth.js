const express = require("express");
const {
    validateBody,
    upload,
    validateOneStringBody,
} = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/auth");
const passport = require("passport");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post(
    "/verify",
    validateOneStringBody(schemas.verifyEmailSchema),
    ctrl.resendVerifyEmail
);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    ctrl.getCurrent
);

router.post(
    "/logout",
    passport.authenticate("jwt", { session: false }),
    ctrl.logout
);

router.patch(
    "/",
    passport.authenticate("jwt", { session: false }),
    validateOneStringBody(schemas.subscriptionSchema),
    ctrl.updateSubscription
);

router.patch(
    "/avatars",
    passport.authenticate("jwt", { session: false }),
    upload.single("avatar"),
    ctrl.updateAvatar
);

module.exports = router;
