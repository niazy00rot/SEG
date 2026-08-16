const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('Google profile:', profile);

                const user = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value
                };

                return done(null, user);

            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;