const jwt = require("jsonwebtoken");

const isAuthorizeForAPI = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                return res.status(403).json({
                    code: 403,
                    message: "Invalid Token"
                });
            }
            if (data.isLive == false) {
                return res.status(405).json({
                    code: 405,
                    message: "Verification Failed"
                });
            }
            const { clientId } = data;
            req.clientId = clientId;
            next();
        });
    } else {
        return res.status(401).json({
            code: 401,
            message: "Authentication Failed"
        });
    }
};

module.exports = isAuthorizeForAPI;