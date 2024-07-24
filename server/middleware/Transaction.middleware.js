const jwt = require('jsonwebtoken')
const AccountModel = require('../models/Account.model')
require('dotenv').config()

const TransactionMidlleware = {
    CheckUserTokenValid: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (token === null) return res.json({ authorization: `You are not authorized: null` })
            if (token === undefined) return res.json({ authorization: `You are not authorized: undefined` })

            jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
                // if (err) return res.sendStatus(403)
                if (err) return res.json({ authorization: `You are not authorized. : ${err}` })
                req.userId = decoded.userId
                next()
            })
        } catch (error) {
            res.status(400).json({ error: `CheckUserTokenValid in user middleware error ${error}` });
        }
    },
    CheckDeveloperTokenValid: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (token === null) return res.json({ authorization: `You are not authorized: null` })
            if (token === undefined) return res.json({ authorization: `You are not authorized: undefined` })

            if (token === process.env.ADMIN_TOKEN) return next()
            res.json({ success: false, message: 'A token is required, nor token is incorrect!' })
        } catch (error) {
            res.status(400).json({ error: `CheckDeveloperTokenValid in transaction middleware error ${error}` });
        }
    },
    CreateTransactionDepositCheckEmptyFields: async (req, res, next) => {
        try {
            const { account, amount } = req.body
            if (!account) return res.json({ success: false, message: 'Account must not be empty!' })
            if (!amount) return res.json({ success: false, message: 'Amount must not be empty!' })
            next()
        } catch (error) {
            res.status(400).json({ error: `CreateTransactionCheckEmptyFields in transaction middleware error ${error}` });
        }
    },
    CreateTransactionCheckEmptyFields: async (req, res, next) => {
        try {
            const { debitAccount, creditAccount, amount } = req.body
            if (!debitAccount) return res.json({ success: false, message: 'Debit account must not be empty!' })
            if (!creditAccount) return res.json({ success: false, message: 'Credit account must not be empty!' })
            if (!amount) return res.json({ success: false, message: 'Amount must not be empty!' })
            next()
        } catch (error) {
            res.status(400).json({ error: `CreateTransactionCheckEmptyFields in transaction middleware error ${error}` });
        }
    },
    GetAccountCheckEmptyFields: async (req, res, next) => {
        try {
            const { accountno } = req.params
            if (!accountno) return res.json({ success: false, message: 'Account must not be empty.' })
            next()
        } catch (error) {
            res.status(400).json({ error: `CreateTransactionCheckEmptyFields in transaction middleware error ${error}` });
        }
    },
    CheckAccountIfExist: async (req, res, next) => {
        try {
            const { debitAccount, creditAccount } = req.body

            const debit = await AccountModel.findOne({ accountno: debitAccount })
            const credit = await AccountModel.findOne({ accountno: creditAccount })

            if (!debit) return res.json({ success: false, message: 'Debit account does not exist!' })
            if (!credit) return res.json({ success: false, message: 'Credit account does not exist!' })
            next()
        } catch (error) {
            res.status(400).json({ error: `CreateTransactionCheckEmptyFields in transaction middleware error ${error}` });
        }
    },
    CheckDepositAccountIfExist: async (req, res, next) => {
        try {
            const { account } = req.body

            const credit = await AccountModel.findOne({ accountno: account })

            if (!credit) return res.json({ success: false, message: 'Account does not exist!' })
            next()
        } catch (error) {
            res.status(400).json({ error: `CreateTransactionCheckEmptyFields in transaction middleware error ${error}` });
        }
    }
}

module.exports = TransactionMidlleware