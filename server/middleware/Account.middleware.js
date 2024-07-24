const AccountModel = require('../models/Account.model')

const AccountMidlleware = {
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
            res.status(400).json({ error: `CheckDeveloperTokenValid in account middleware error ${error}` });
        }
    },
    CreateAccountCheckEmptyFields: async (req, res, next) => {
        try {
            next()
        } catch (error) {
            res.status(400).json({ error: `CreateCheckEmptyFields in account middleware error ${error}` });
        }
    },
    CreateAccountCheckAccountIfExists: async (req, res, next) => {
        try {
            next()
        } catch (error) {
            res.status(400).json({ error: `CreateAccountCheckAccountIfExists in account middleware error ${error}` });
        }
    },
    CheckAccountIfExists: async (req, res, next) => {
        try {
            const { uid } = req.params

            const data = await AccountModel.findOne({ userId: uid })
            if (data) return next()
            res.json({ success: false, message: 'There are no account existing.' })
        } catch (error) {
            res.status(400).json({ error: `CreateAccountCheckAccountIfExists in account middleware error ${error}` });
        }
    },
    CreateAccountCheckAccountNo: async (req, res, next) => {
        try {
            const accounts = await AccountModel.find()
            const accountParseString = accounts.map(account => parseInt(account.accountno.match(/\d+/), 10)).filter(num => !isNaN(num))

            if (accounts.length > 0) {
                let largestNumber = Math.max(...accountParseString)
                largestNumber++
                const accno = largestNumber.toString().padStart(9, '0')

                req.accno = accno
                next()
            } else {
                const accno = '000000001'
                req.accno = accno
                next()
            }
        } catch (error) {
            res.status(400).json({ error: `CreateAccountCheckAccountNo in account middleware error ${error}` });
        }
    },
    UpdateAccountCheckEmptyFields: async (req, res, next) => {
        try {
            next()
        } catch (error) {
            res.status(400).json({ error: `UpdateAccountCheckEmptyFields in account middleware error ${error}` });
        }
    },
}

module.exports = AccountMidlleware