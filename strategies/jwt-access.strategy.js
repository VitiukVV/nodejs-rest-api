const passport = require("passport");
const passportJWT = require("passport-jwt");
const { User } = require("../models/user");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

passport.use(
    new Strategy(
        {
            secretOrKey: SECRET_KEY,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
        },
        async (req, payload, done) => {
            try {
                const user = await User.findById(payload.id);
                if (!user) {
                    return done(null, false);
                }

                const authHeader = req.headers.authorization || "";
                const token = authHeader.replace("Bearer ", "");

                if (!user.token || user.token !== token) {
                    return done(null, false);
                }

                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);
