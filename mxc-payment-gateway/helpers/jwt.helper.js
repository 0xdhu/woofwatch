const jwt = require("jsonwebtoken");

const createToken = (id, email, verified, role) => {
    return jwt.sign(
        {
            userId: id,
            email: email,
            role: role,
            status: verified,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: 1800, // 30min = 1800s
        }
    );
};

const createAPIToken = (clientId, isLive) => {
    return jwt.sign(
        {
            clientId,
            isLive
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h', // 1h
        }
    );
}

module.exports = {
    createToken,
    createAPIToken
};