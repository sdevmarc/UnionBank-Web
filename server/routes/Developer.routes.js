const express = require('express')
const router = express.Router()

const DeveloperController = require('../controllers/Developer.controller')
const DeveloperMiddleware = require('../middleware/Developer.middleware')
const TransactionMiddleware = require('../middleware/Transaction.middleware')
const UserMiddleware = require('../middleware/User.middleware')

router.post('/createdevelopertoken/:userId',
    DeveloperMiddleware.CheckAdminTokenValid,
    DeveloperMiddleware.CreateDeveloperTokenCheckTokenIfExist,
    DeveloperMiddleware.CreateDeveloperTokenHashed,
    DeveloperController.CreateDeveloperToken
)

router.get('/announcements', 
    DeveloperMiddleware.CheckAdminTokenValid,
    DeveloperController.GetAllAnnouncement
)

router.get('/notifications/:userId',
    UserMiddleware.CheckDeveloperTokenValid,
    DeveloperController.GetUserNotification
)

router.post('/createannouncement',
    DeveloperMiddleware.CheckAdminTokenValid,
    DeveloperController.CreateAnnouncement
)

router.post('/deleteannouncement',
    DeveloperMiddleware.CheckAdminTokenValid,
    DeveloperController.DeleteAnnouncement
)

router.get('/unionbank/account/:accountno',
    DeveloperMiddleware.CheckDeveloperTokenValid,
    TransactionMiddleware.GetAccountCheckEmptyFields,
    DeveloperController.GetRequestAccountNo
)

router.post('/unionbank/transfertransaction',
    DeveloperMiddleware.CheckDeveloperTokenValid,
    TransactionMiddleware.CreateTransactionCheckEmptyFields,
    TransactionMiddleware.CheckAccountIfExist,
    DeveloperController.TransferTransaction
)

router.get('/tokens/:userId',
    DeveloperMiddleware.CheckDeveloperTokenValid,
    DeveloperController.GetUserTokens
)

router.post('/deletetoken/:developerId',
    DeveloperMiddleware.CheckDeveloperTokenValid,
    DeveloperController.DeleteToken
)

router.get('/unionbank/myaccount/auth/:accountno',
    DeveloperMiddleware.CheckDeveloperTokenValid,
    DeveloperController.GenerateUrl
)

router.get('/unionbank/myaccount/transactions',
    DeveloperMiddleware.CheckDeveloperTokenValid,
    DeveloperMiddleware.CheckUserTokenValid,
    DeveloperController.GetAllUserTransaction
)

router.get('/it/auditlog',
    UserMiddleware.CheckDeveloperTokenValid,
    DeveloperController.GetAllAuditLog
)

router.get('/it/auditlog/:searchId',
    UserMiddleware.CheckDeveloperTokenValid,
    DeveloperController.SearchAuditLog
)

router.get('/it/backup',
    UserMiddleware.CheckDeveloperTokenValid,
    DeveloperController.BackUp
)

router.get('/it/restore',
    UserMiddleware.CheckDeveloperTokenValid,
    DeveloperController.Restore
)

module.exports = router