const express = require('express')
const router = express.Router()

const AccountController = require('../controllers/Account.controller')
const AccountMiddleware = require('../middleware/Account.middleware')

router.post('/createaccount',
    AccountMiddleware.CheckDeveloperTokenValid,
    AccountMiddleware.CreateAccountCheckEmptyFields,
    AccountMiddleware.CreateAccountCheckAccountIfExists,
    AccountMiddleware.CreateAccountCheckAccountNo,
    AccountController.CreateAccount
)

router.get('/accounts',
    AccountMiddleware.CheckDeveloperTokenValid,
    AccountController.GetAllAccount
)

router.get('/useraccount/:uid',
    AccountMiddleware.CheckDeveloperTokenValid,
    AccountMiddleware.CheckAccountIfExists,
    AccountController.GetUserAccount
)

router.get('/accounts/:searchId',
    AccountMiddleware.CheckDeveloperTokenValid,
    AccountController.SearchAccount
)

router.post('/updateaccount/:accountId', //temp
    AccountMiddleware.CheckDeveloperTokenValid,
    AccountMiddleware.UpdateAccountCheckEmptyFields,
    AccountController.UpdateAccount
)

router.post('/updateactiveaccount/:accountId',
    AccountMiddleware.CheckDeveloperTokenValid,
    AccountController.UpdateActiveAccount
)

module.exports = router