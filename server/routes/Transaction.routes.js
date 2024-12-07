const express = require('express')
const router = express.Router()

const TransactionController = require('../controllers/Transaction.controller')
const TransactionMiddleware = require('../middleware/Transaction.middleware')

router.post('/deposittransaction',
    TransactionMiddleware.CheckDeveloperTokenValid,
    TransactionMiddleware.CreateTransactionDepositCheckEmptyFields,
    TransactionMiddleware.CheckDepositAccountIfExist,
    TransactionController.DepositTransaction
)

router.post('/withdrawtransaction',
    TransactionMiddleware.CheckDeveloperTokenValid,
    TransactionMiddleware.CreateTransactionDepositCheckEmptyFields,
    TransactionController.WithdrawTransaction
)

router.post('/transfertransaction',
    TransactionMiddleware.CheckUserTokenValid,
    TransactionMiddleware.CreateTransactionCheckEmptyFields,
    TransactionMiddleware.CheckAccountIfExist,
    TransactionController.TransferTransaction
)

router.get('/transactions',
    TransactionMiddleware.CheckDeveloperTokenValid,
    TransactionController.GetAllTransaction
)

router.get('/transactions/:userId',
    TransactionMiddleware.CheckDeveloperTokenValid,
    TransactionController.GetAllUserTransaction
)

router.get('/searchtransactions/:searchId',
    TransactionMiddleware.CheckDeveloperTokenValid,
    TransactionController.SearchTransaction
)

// Add route for highest transactions
router.get('/highesttransactions',
    TransactionMiddleware.CheckDeveloperTokenValid, // Optional middleware to validate token
    TransactionController.HighestTransaction // Controller method to fetch highest transactions
);


module.exports = router