const express = require('express')
const cors = require('cors')
const app = express()

const ConnectToDatabase = require('../config/DBHandler')

const UserRoute = require('../routes/User.routes')
const AccountRoute = require('../routes/Account.routes')
const TransactionRoute = require('../routes/Transaction.routes')
const DeveloperRoute = require('../routes/Developer.routes')

const DeveloperMiddleware = require('../middleware/Developer.middleware')

app.use(cors({
    origin: '*',
    methods: ['POST', 'GET'],
    credentials: true,
}))

ConnectToDatabase()

app.use(express.json())

app.get('/', DeveloperMiddleware.CheckDeveloperTokenValid, (req, res) => {
    res.json({
        message: `This is Home`
    })
})

app.use('/api', UserRoute)

app.use('/api', AccountRoute)

app.use('/api', TransactionRoute)

app.use('/api', DeveloperRoute)

module.exports = app;