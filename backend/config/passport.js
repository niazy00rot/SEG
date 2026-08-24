const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {
    is_registered,
    add_user,
    get_user_id,
    is_google_id_registered,
    add_google_id
} = require('../service/oauth.js');



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

                const googleId = profile.id;
                const name = profile.displayName;
                const email = profile.emails[0].value;

                let userId;

                if (await is_registered(email)) {
                    if (await is_google_id_registered(googleId)) {
                        userId = await get_user_id(googleId);
                    } 

                    else {
                        await add_google_id(googleId, email);
                        userId = await get_user_id(googleId);
                    }
                } 

                else {
                    await add_user(googleId, name, email);
                    userId = await get_user_id(googleId);
                }

                const user = {id: userId,googleId,name,email};
                return done(null, user);
            } 
            
            catch (error) {
                console.error('Error in GoogleStrategy:', error);
                return done(error, null);
            }
        }
    )
);

module.exports = passport;