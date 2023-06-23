const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// GET ACCESS CODE
const credentials = {
    client: {
        id: process.env.APP_ID,
        secret: process.env.APP_PASSWORD
    },
    auth: {
        tokenHost: 'https://login.microsoftonline.com',
        authorizePath: 'common/oauth2/v2.0/authorize',
        tokenPath: 'common/oauth2/v2.0/token'
    }
};

const oauth2 = require('simple-oauth2').create(credentials);

exports.getAuthUrl = () => {
    const returnVal = oauth2.authorizationCode.authorizeURL({
        redirect_uri: process.env.REDIRECT_URI,
        scope: process.env.APP_SCOPES
        // scope: 'api://9aea5857-5327-4087-8cd5-508c13282a9f'
    });
    // console.log(`GENERATED AUTH URL: ${returnVal}`);
    return returnVal;
}

// GET TOKEN FROM CODE
exports.getTokenFromCode = async (auth_code, res) => {
    try {
        let result = await oauth2.authorizationCode.getToken({
            code: auth_code,
            redirect_uri: process.env.REDIRECT_URI,
            scope: process.env.APP_SCOPES
        });

        const token = oauth2.accessToken.create(result);
        // console.log({ token });
        // console.log('=======TOKEN CREATED:');
        // console.log(token.token);
        // console.log('=====TEST STRINGIFY')
        // console.log(JSON.stringify(token));

        // Store token in a session cookie. Also get the logged in user's name
        // Save the token and username in the session
        await saveValuesToCookie(token, res);

        return token.token.access_token;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
}

const saveValuesToCookie = async (token, res) => {
    try {
        // Parse the identity token
        const user_outlook = jwt.decode(token.token.id_token);
        // console.log(">>>>>>", { user_outlook })
        /*console.log('========THIS IS TOKEN.TOKEN.ID_TOKEN:');
        console.log(user_outlook);*/

        // Save in db
        // Check if user already there? Yes: Update, No: Add
        const user = await userModel.findOne({ email: user_outlook.preferred_username });
        // console.log({ user })
        if (user) {
            user.name = user_outlook.name;
            user.email = user_outlook.preferred_username; // This is unique
            user.accesstoken = token.token.access_token;
            user.refreshtoken = token.token.refresh_token;
            user.expire = token.token.expires_at.getTime();
            await user.save();
        } else {
            const data = {
                name: user_outlook.name,
                email: user_outlook.preferred_username, // This is unique
                accesstoken: token.token.access_token,
                refreshtoken: token.token.refresh_token,
                expire: token.token.expires_at.getTime()
            }
            await new userModel(data).save();
        }

        // Save user info in a cookie
        res.cookie('graph_user_name', user_outlook.name, {
            maxAge: 3600000,
            httpOnly: false
        });

        res.cookie('graph_email', user_outlook.preferred_username, {
            maxAge: 3600000,
            httpOnly: false
        });

        res.cookie('graph_access_token', token.token.access_token, {
            maxAge: 3600000,
            httpOnly: false
        });

        // Save the refresh token in a cookie
        res.cookie('graph_refresh_token', token.token.refresh_token, {
            //maxAge: 7200000,
            expires: new Date(2147483647000), // So it never expires
            httpOnly: false
        });

        // Save the token expiration time in a cookie
        res.cookie('graph_token_expires', token.token.expires_at.getTime(), {
            maxAge: 3600000,
            httpOnly: false
        });

        /*
        console.log('========THIS IS EXPIRE TIME');
        console.log(token.token.expires_at);
        console.log(token.token.expires_in);
        console.log(token.token.expires_at.getTime());
        */
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
}
exports.saveValuesToCookie = saveValuesToCookie;

// CLEAR COOKIES TO ASSIST LOGOUT
exports.clearCookies = res => {
    try {
        // Clear cookies

        res.clearCookie('graph_user_name', {
            maxAge: 3600000,
            httpOnly: false
        });

        res.clearCookie('graph_email', {
            maxAge: 3600000,
            httpOnly: false
        });

        res.clearCookie('graph_access_token', {
            maxAge: 3600000,
            httpOnly: false
        });

        res.clearCookie('graph_refresh_token', {
            //maxAge: 7200000,
            expires: new Date(2147483647000),
            httpOnly: false
        });

        res.clearCookie('graph_token_expires', {
            maxAge: 3600000,
            httpOnly: false
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getAccessToken = async (cookies, res) => {
    try {
        // console.log({ cookies });
        // Do we have access token cached
        let token = cookies.graph_access_token;

        if (token) {
            // We have a token but has it expired
            // Expires 5 mins early to account for clock differences
            const FIVE_MINUTES = 300000;
            const expiration = new Date(
                parseFloat(cookies.graph_token_expires - FIVE_MINUTES)
            );

            if (expiration > new Date()) {
                // Expiration time is after current time
                // Token is still good
                const result = {
                    accessToken: token,
                    username: cookies.graph_user_name,
                    email: cookies.graph_email
                }
                return result;
            }
        }

        // No token or it's expired, do we have a refresh token
        const refresh_token = cookies.graph_refresh_token;
        if (refresh_token) {
            const newToken = await oauth2.accessToken
                .create({ refresh_token: refresh_token })
                .refresh();

            // console.log({ newToken });

            // Save the new token to cookie.
            // If you go back to the function definition, all the important info are saved in cookies again
            await saveValuesToCookie(newToken, res);

            var result = {
                access_token: newToken.token.access_token,
                username: newToken.token.id_token.name,
                email: newToken.token.id_token.preferred_username
            };

            return result;
        }
        // Test find in db

        // Nothing in the cookies that helps, return empty
        return null;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}