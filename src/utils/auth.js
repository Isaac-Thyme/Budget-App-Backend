const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const expiration = '2h';

module.exports = {
    signToken: function ({ username, _id }) {
        const payload = { username, _id }

        let token = jwt.sign({ data: payload }, SECRET, { expiresIn: expiration });
        return token;
    },
    authMiddleware: function (req, res, next) {
        // allow token to be sent via the body or params
        let token = req.body.token || req.query.token;

        // seperate "Bearer" from "<tokenvalue>"
        // if (req.body.token) {
        //     token = token
        //         .split(' ')
        //         .pop()
        //         .trim();
        // }

        // if no token, return request object as is
        if (!token) {
            res.status(401).send('No token identified');
            return;
        }

        try {
            // decode and attach user data to request object
            const { data } = jwt.verify(token, SECRET, { maxAge: expiration });
            req.username = data.username;
            next();
        } catch {
            console.log('Invalid token');
        }
    }
}