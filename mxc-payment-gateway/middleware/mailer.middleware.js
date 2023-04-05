const mailerActivated = (flag) => (req, res, next) => {
    const isMailerServiceActivated = process.env.EMAIL_VERIFICATION_REQUIRED;
    if (isMailerServiceActivated === flag) {
        next();
    } else {
        return res.status(401).json({
            code: 401,
            message: "Authentication Failed"
        });
    }
};

module.exports = mailerActivated;