const express = require('express')
const router = express.Router()

const UserController = require('../controllers/User.controller')
const UserMiddleware = require('../middleware/User.middleware')

router.post('/loginuser',
    UserMiddleware.CheckDeveloperTokenValid,
    UserMiddleware.LoginUserCheckEmptyFields,
    UserMiddleware.LoginUserCheckEmail,
    UserMiddleware.LoginUserCheckIsActive,
    UserMiddleware.LoginUserCheckPassword
)
router.post('/verify',
    UserMiddleware.CheckDeveloperTokenValid,
    UserMiddleware.EmailVerification
)

router.post('/createuser',
    UserMiddleware.CheckDeveloperTokenValid,
    UserMiddleware.CreateUserCheckEmptyFields,
    UserMiddleware.CreateUserCheckUserIfExists,
    UserMiddleware.CreateUserHashedPassword,
    UserMiddleware.CreateUserCheckAdminIfDoesNotExist,
    UserController.CreateUser
)

router.get('/users',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.GetAllUsers
)

router.get('/developerusers',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.GetAllDeveloperUsers
)

router.get('/employedusers',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.GetAllEmployedUsers
)

router.get('/users/:userId',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.GetCurrentUser
)

router.get('/rbusers',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.GetAllRBUsers
)

router.get('/rbaccounts',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.GetAllRBAccounts
)

router.get('/searchrdeveloperusers/:searchId',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.SearchDeveloperUsers
)

router.get('/searchremployedusers/:searchId',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.SearchEmployedUsers
)

router.get('/searchrbusers/:searchId',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.SearchRBUser
)

router.get('/searchrbaccounts/:searchId',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.SearchRBAccounts
)

router.post('/updateuser/:userId',
    UserMiddleware.CheckDeveloperTokenValid,
    UserMiddleware.UpdateUserCheckEmptyFields,
    UserController.UpdateUser
)

router.post('/updateactiveuser/:userId',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.UpdateActiveUser
)

router.get('/analytics/hr',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.Analytics_HumanResource
)

router.get('/analytics/rb',
    UserMiddleware.CheckDeveloperTokenValid,
    UserController.Analytics_RB
)

module.exports = router