const authHelper = require('../helpers/auth.helper');

const authController = {
    getAuth: async (req, res) => {
        try {
            const code = req.query.code;
            // console.log({ code })
            // If code is present, use it
            if (code) {
                const token = await authHelper.getTokenFromCode(code, res);
                // res.json(token);
                res.redirect('http://localhost:5002');
            } else {
                // Otherwise complain
                res.render('errors/error', {
                    title: 'Error',
                    message: 'Authorization error',
                    error: {
                        status: 'Missing code parameter'
                    }
                });

                // res.status(400).json({
                //     title: 'Error',
                //     message: 'Authorization error',
                //     error: {
                //         status: 'Missing code parameter'
                //     }
                // })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    },
    signOut: async (req, res) => {
        try {
            console.log('receive call from action');
            authHelper.clearCookies(res);
            // Redirect to home
            res.redirect('http://localhost:5002');
            // res.status(200).json("Signed out successfully");
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    },
    authorize: async (req, res) => {
        try {
            const accessIdentity = await authHelper.getAccessToken(req.cookies, res);
            // console.log({ accessIdentity })
            let parms = {
                title: 'V Booking',
                active: {
                    home: true
                }
            };

            if (accessIdentity) {
                parms.user = accessIdentity.username;
                //parms.debug = `User: ${accessIdentity.username}\nAccess Token: ${accessIdentity.access_token}`;
                parms.email = accessIdentity.email;
                //parms.access_token = accessIdentity.access_token;
            } else {
                parms.signInUrl = authHelper.getAuthUrl();
                parms.debug = parms.signInUrl;
            }
            // res.render('index/welcome', parms);
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5002');
            res.status(200).json(parms);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = authController;