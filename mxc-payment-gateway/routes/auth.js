var express = require('express');
const { emailSignIn, standardChangeCredential, requestChangeCredentials, verifyEmailAndChangePassword, createClientKey, getClientKeyList, deleteClientKey, getAPIToken } = require('../controllers/auth.controller');
const mailerActivated = require('../middleware/mailer.middleware');
var router = express.Router();
// ** middleware
const isAuthorize = require('../middleware/auth.middleware');
const isAdmin = isAuthorize("admin");
/** 
 * @dev admin sign in
 * @param { email, password }
 * @return { email, token }
 * */
router.post('/admin/signin', emailSignIn);

/** 
 * @notice admin change normal standard credential
 * @dev this works only if you set EMAIL_VERIFICATION_REQUIRED = false or none in env
 * @param { currentEmail, currentPassword, newEmail, newPassword }
 * @return { email, token }
 * */
router.post('/admin/changeCredentials', mailerActivated(false), standardChangeCredential);

/** 
 * @notice admin verify & change credential
 * @dev this works only if you set EMAIL_VERIFICATION_REQUIRED = true in env
 * @param { currentEmail, newEmail, newPassword, verificationCode }
 * @return { email, token }
 * */
router.post('/admin/verifyAndChangeCredentials', mailerActivated(true), verifyEmailAndChangePassword);

/** 
 * @notice admin request to change credential
 * @dev this works only if you set EMAIL_VERIFICATION_REQUIRED = true in env
 * @param { currentEmail, currentPassword }
 * @return { message }
 * */
router.post('/admin/requestCredentialChanges', mailerActivated(true), requestChangeCredentials);

/** 
 * @dev create client id and apikey 
 * @param account_id
 * @return { client_id, secret_key }
 * */
router.post('/create/apikey', isAdmin, createClientKey);

/** 
 * @dev delete client id and apikey 
 * @param clientId
 * @return { message } result
 * */
router.post('/delete/apikey', isAdmin, deleteClientKey);

/** 
 * @dev Get API token for medusa plugin
 * @param { x-client-id, x-secret-key }
 * @return { token } result
 * */
router.post('/apitoken/login', getAPIToken);

/** 
 * @dev get token to be used in header when call API
 * @param { client_id, secret_key }
 * @return { token }
 * */
router.post('/get/keyList', isAdmin, getClientKeyList);

module.exports = router;
