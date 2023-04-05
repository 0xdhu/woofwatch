const crypto = require('crypto');
const { mailerService, generateCode, EmailVerificationTemplate } = require("../helpers/email.helper");
const { createToken, createAPIToken } = require("../helpers/jwt.helper");
const Auth = require("../models/Auth.model");
const ClientKey = require('../models/ClientKey.model');

/**
 * @dev create initial credential for super admin
 */
const createSuperInitialAdmin = async () => {
    try {
        const doc = await Auth.find();
        if (doc && doc.length > 0) {
            return true;
        }
    
        const initialCredential = {
            email: "erc-payment@store.com",
            password: "Qw123@#4!",
            role: "admin",
            verified: true
        }
        if (await Auth.create(initialCredential)) {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}

async function emailSignIn(req, res) {
    try {
        const { email, password } = req.body;
        const userData = await Auth.findOne({ email });
        if (userData) {
            const isPasswordCorrect = await userData.checkPassword(password);
            if (isPasswordCorrect) {
                if (userData.verified) {
                    const token = createToken(
                        userData.id,
                        userData.email,
                        userData.verified,
                        userData.role
                    );
                    return res.status(200).send({
                        code: 200,
                        message: 'success',
                        data: {
                            token: token
                        }
                    });
                } else {
                    return res.status(401).send({
                        code: 401,
                        message: "Your email has not been verified. Please check your email"
                    })
                }
            }
        }
        return res.status(401).send({
            code: 401,
            message: "Your email or password is not correct"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
}

async function standardChangeCredential(req, res) {
    try {
        const { currentEmail, currentPassword, newEmail, newPassword } = req.body;
        if (!newEmail && newEmail === "" && !newPassword && newPassword === "") {
            return res.status(400).json({
                code: 400,
                message: "Invalid parameters"
            });
        }
        const userData = await Auth.findOne({ email: currentEmail });

        if (userData) {
            const isPasswordCorrect = await userData.checkPassword(currentPassword);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    code: 401,
                    message: "Password is not correct",
                });
            }
            if (newEmail) {
                userData.email = newEmail;
            }
            if (newPassword) {
                userData.password = newPassword;
            }
            await userData.save();

            const token = createToken(
                userData.id,
                userData.email,
                true,
                userData.role
            );
            return res.status(200).json({
                code: 200,
                message: "Success",
                data: {
                    email: userData.email,
                    token: token
                }
            });
        }
        return res.status(401).json({
            code: 401,
            message: "Verification failed"
        })
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
}

/** 
 * @notice admin verify & change credential
 * @dev this works only if you set EMAIL_VERIFICATION_REQUIRED = true in env
 */
async function verifyEmailAndChangePassword(req, res) {
    try {
        const { currentEmail, newEmail, newPassword, verificationCode } = req.body;
        if (
            (!newEmail || newEmail === "") && 
            (!newPassword || newPassword === "") && 
            (verificationCode && verificationCode !== "")
        ) {
            return res.status(400).json({
                code: 400,
                message: "Invalid parameters"
            });
        }

        const userData = await Auth.findOne({ email: currentEmail });

        if (userData) {
            if (userData.verificationCode === verificationCode) {
                if (newEmail) {
                    userData.email = newEmail;
                }
                if (newPassword) {
                    userData.password = newPassword;
                }
                await userData.save();
    
                const token = createToken(
                    userData.id,
                    userData.email,
                    true,
                    userData.role
                );
                return res.status(200).json({
                    code: 200,
                    message: "Success",
                    data: {
                        email: userData.email,
                        token: token
                    }
                });
            } else {
                const currentVerifyAttemptCount = userData.verifyAttemptCount + 1
                if (currentVerifyAttemptCount == 2) {
                    userData.verifyAttemptCount = 0;
                    userData.verificationCode = "";

                    return res.status(401).json({
                        code: 401,
                        message: "Too much sent wrong code. Try send request again"
                    })
                } else {
                    userData.verifyAttemptCount = currentVerifyAttemptCount;
                    
                    return res.status(401).json({
                        code: 401,
                        message: "Invalid code"
                    })
                }
            }
        }
        return res.status(401).json({
            code: 401,
            message: "This account does not exist"
        })
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
}

/** 
 * @notice admin request to change credential
 * @dev this works only if you set EMAIL_VERIFICATION_REQUIRED = true in env
 */
async function requestChangeCredentials(req, res) {
    try {
        const { currentEmail, currentPassword } = req.body;
        const userData = await Auth.findOne({ email: currentEmail });
        if (userData) {
            const isPasswordCorrect = await userData.checkPassword(currentPassword);

            if (isPasswordCorrect) {
                // Generate verification code
                const verificationCode = generateCode();
                // Email send (verfication)
                await mailerService.sendMail({
                    from: process.env.NODE_MAILER_USER,
                    to: currentEmail,
                    subject: "Welcome to Crypto Payment Gateway!",
                    text: "Verify your email",
                    html: EmailVerificationTemplate(verificationCode),
                });
                return res.status(200).json({
                    code: 400,
                    message: "Verification code is sent to your email. Please check it."
                });
            }
            return res.status(401).json({
                code: 401,
                message: "Password is not correct"
            });
        } else {
            return res.status(401).json({
                code: 401,
                message: "No user found"
            });
        }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error"
        });
    }
}

const createClientKey = async(req, res) => {
    try {
        // Generate unique client ID and secret key
        const clientId = crypto.randomBytes(16).toString('hex');
        const secretKey = crypto.randomBytes(32).toString('hex');
        const newClient = {
            clientId,
            secretKey,
            createAt: Date.now(),
            updateAt: Date.now()
        }
        if (await ClientKey.create(newClient)) {
            return res.status(200).send({
                code: 200,
                message: "success",
                data: newClient
            });;
        }
        return res.status(400).send({
            code: 400,
            message: "DB transaction failed",
        });;
    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error"
        });
    }
}

const getClientKeyList = async(req, res) => {
    try {
        const docs = await ClientKey.find().sort({ createAt: -1 });
        return res.status(200).send({
            code: 200,
            message: "success",
            data: docs
        });;
    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error"
        });
    }
}
const deleteClientKey = async(req, res) => {
    try {
        const { clientId } = req.body;

        const doc = await ClientKey.deleteOne({ clientId });
        if (doc) {
            return res.status(200).send({
                code: 200,
                message: "success",
            });;
        }
        return res.status(400).send({
            code: 400,
            message: "This key does not exist on server",
        });;
    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error"
        });
    }
}

const getAPIToken = async(req, res) => {
    try {
        const clientId = req.headers['x-client-id'];
        const secretKey = req.headers['x-secret-key'];

        const doc = await ClientKey.findOne({ clientId, secretKey });
        if (doc) {
            const token = createAPIToken(clientId);
            return res.status(200).send({
                code: 200,
                message: "successd",
                token
            });;
        }
        return res.status(400).send({
            code: 400,
            message: "Invalid keys",
        });;
    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error"
        });
    }
}

module.exports = {
    createClientKey,
    createSuperInitialAdmin,
    emailSignIn,
    verifyEmailAndChangePassword,
    requestChangeCredentials,
    standardChangeCredential,
    getClientKeyList,
    getAPIToken,
    deleteClientKey
}