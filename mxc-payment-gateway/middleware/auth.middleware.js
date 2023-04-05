const jwt = require("jsonwebtoken");

const isAuthorize = (role) => (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    code: 403,
                    message: "Invalid Token"
                });
            }
            if (user.status == false) {
                return res.status(405).json({
                    code: 405,
                    message: "Verification Failed"
                });
            }
            if (user.role !== role) {
                return res.status(401).json({
                    code: 401,
                    message: "Unauthorized"
                });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({
            code: 401,
            message: "Authentication Failed"
        });
    }
};

module.exports = isAuthorize;