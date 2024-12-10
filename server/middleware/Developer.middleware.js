const DeveloperModel = require('../models/Developer.model')
const AuditLog = require('../models/Auditlog.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const DeveloperMiddleware = {
    CreateDeveloperTokenCheckTokenIfExist: async (req, res, next) => {
        try {
            next()
        } catch (error) {
            res.status(400).json({ error: `CheckDeveloperTokenCheckIfExist in developer middleware error ${error}` });
        }
    },
    CheckAdminTokenValid: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]

            if (token === null) return res.json({ authorization: `You are not authorized: null` })
            if (token === undefined) return res.json({ authorization: `You are not authorized: undefined` })

            if (token === process.env.ADMIN_TOKEN) return next()
            res.json({ success: false, message: 'A token is required, nor token is incorrect!' })
        } catch (error) {
            res.status(400).json({ error: `CheckAdminTokenValid in developer middleware error ${error}` });
        }
    },
    CheckDeveloperTokenValid: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (token === null) return res.json({ authorization: `You are not authorized: null` })
            if (token === undefined) return res.json({ authorization: `You are not authorized: undefined` })
            const testToken = await DeveloperModel.findOne({ token: token })

            if (testToken || token === process.env.ADMIN_TOKEN) return next()
            res.json({ success: false, message: 'A token is required, nor token is incorrect!' })
        } catch (error) {
            res.status(400).json({ error: `CheckDeveloperTokenValid in developer middleware error ${error}` });
        }
    },
    CheckUserTokenValid: async (req, res, next) => {
        try {
            const token = req.headers['accountno']

            if (token === null) return res.json({ authorization: `You are not authorized: null` })
            if (token === undefined) return res.json({ authorization: `You are not authorized: undefined` })
         
            jwt.verify(token, process.env.ADMIN_TOKEN, (err, user) => {
                if (err) return res.json({ success: false, message: 'A token is required, nor token is incorrect!' })
                req.user = user;
                next();
            });

        } catch (error) {
            res.status(400).json({ error: `CheckUserTokenValid in developer middleware error ${error}` });
        }
    },
    CreateDeveloperTokenHashed: async (req, res, next) => {
        try {
            const min = 1000000000
            const max = 9999999999
            const RandomIntegers = Math.floor(Math.random() * (max - min + 1)) + min
            const hash = bcrypt.hash(RandomIntegers.toString(), 10)
            req.hashedToken = hash
            next()
        } catch (error) {
            res.status(400).json({ error: `CreateDeveloperTokenHashed in developer middleware error ${error}` });
        }
    }
}

module.exports = DeveloperMiddleware