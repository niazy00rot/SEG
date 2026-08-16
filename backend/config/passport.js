const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { is_registered, add_user, get_user_id, is_google_id_registered, add_google_id } = require('../service/oauth.js');
const jwt = require('jsonwebtoken')

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
                if(await is_registered(user.email) ){
                    if(await is_google_id_registered(user.googleId)){
                        const user_id = await get_user_id(user.googleId);
                        const token = jwt.sign({ id: user_id }, process.env.jwt_secret, { expiresIn: '1h' });
                        return done(token);
                    }
                    else{
                        await add_google_id(user.googleId, user.email);
                        const user_id = await get_user_id(user.googleId);
                        const token = jwt.sign({ id: user_id }, process.env.jwt_secret, { expiresIn: '1h' });
                        return done(token);
                    }
                }
                else{
                    await add_user(user.googleId, user.name, user.email);
                    const user_id = await get_user_id(user.googleId);
                    const token = jwt.sign({ id: user_id }, process.env.jwt_secret, { expiresIn: '1h' });
                    return done(token);
                }
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;