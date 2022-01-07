const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const {
        authorization
    } = req.headers;

    if (!authorization) {
        return res.status(400).json({ message: 'Please, provide "authorization" header' });
    }

    const [, token] = authorization.split(' ');

    if (!token) {
        return res.status(400).json({ message: 'Please, include token to request' });
    }

    try {
        const tokenPayload = jwt.verify(token, 'secret');
        req.user = {
            user_id: tokenPayload.user_id,
            username: tokenPayload.username,
            role: tokenPayload.role
        };
        console.log(token)
        console.log(req.user.role)
        if (req.user.role != 'registrator') {
            return res.status(403).json({ message: 'No rights' });
        }
        next();
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

module.exports = authMiddleware