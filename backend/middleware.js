const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

export function authMiddleware(){

    const authHeader = req.header.authorization;

    if(!authHeader || !authHeader.startswith('Bearer '))
            return res.status(403).json(
        {
        message:"Bearer token invalid"
    }
)

const token = authHeader.split('Bearer ')[1];

try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;
    next()


} catch (error) {
    return res.status(403).json({});
    console.log('errror in authMiddleware')
}
}

module.exports = {
    authMiddleware
}