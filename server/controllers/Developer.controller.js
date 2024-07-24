const DeveloperModel = require('../models/Developer.model')
const TransactionModel = require('../models/Transactions.model')
const AccountModel = require('../models/Account.model')
const AuditLog = require('../models/Auditlog.model')
const AnnouncementModel = require('../models/Announcement.model')
const NotificationModel = require('../models/Notifications.model')
const jwt = require('jsonwebtoken')

const { exec } = require('child_process')

const Log = async ({ userId, action, collectionName, documentId, changes, description }) => {
    await AuditLog.create({ userId, action, collectionName, documentId, changes, description })
}

const Notify = async ({ user, type, content }) => {
    await NotificationModel.create({ user, type, content })
}

const getClientIp = (req) => {
    let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Handle both IPv4 and IPv6
    if (ipAddress.includes('::ffff:')) {
        ipAddress = ipAddress.split(':').reverse()[0];
    }

    if (ipAddress === '::1') {
        ipAddress = '127.0.0.1'; // Loopback address for IPv4
    }

    return ipAddress;
};

const dbName = 'unionbank';
const mongodumpPath = '"C:\\Program Files\\MongoDB\\Tools\\100\\bin\\mongodump"';
const mongorestorePath = '"C:\\Program Files\\MongoDB\\Tools\\100\\bin\\mongorestore"';

const DeveloperController = {
    CreateDeveloperToken: async (req, res) => {
        try {
            const { userId } = req.params
            const token = await req.hashedToken
            const newToken = await DeveloperModel.create({ user: userId, token })
            Log({
                userId,
                action: 'create',
                collectionName: 'Developer',
                documentId: newToken?._id,
                changes: {
                    user: userId, token: token
                },
                description: `${userId} created a token.`
            })

            res.json({ success: true, message: 'Tokens created successfully!', newToken })
        } catch (error) {
            res.json({ error: `CreateDeveloperToken in developer controller error ${error}` });
        }
    },
    GetUserTokens: async (req, res) => {
        try {
            const { userId } = req.params
            const data = await DeveloperModel.find({ user: userId })
            res.json({ success: true, message: 'Fetch tokens successfully!', data })
        } catch (error) {
            res.json({ error: `GetAllTokens in developer controller error ${error}` });
        }
    },
    GetRequestAccountNo: async (req, res) => {
        try {
            const { accountno } = req.params
            const data = await AccountModel.findOne({ accountno: accountno })

            if (data) return res.json({ success: true, message: 'Account exist!' })
            res.json({ success: false, message: 'Account does not exist!' })
        } catch (error) {
            res.json({ error: `GetAllTokens in developer controller error ${error}` });
        }
    },
    TransferTransaction: async (req, res) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            const testIp = getClientIp(req)

            const { user: developerUserId, _id: developerId } = await DeveloperModel.findOne({ token: token })

            const { debitAccount, creditAccount, amount } = req.body
            const transferAmount = parseFloat(amount)
            const tax = 10

            const { _id: debitAccountId, userId: debitUser } = await AccountModel.findOne({ accountno: debitAccount })
            const { _id: creditAccountId, userId: creditUser } = await AccountModel.findOne({ accountno: creditAccount })

            const { balance: debitBalance } = await AccountModel.findById(debitAccountId)
            const { balance: creditBalance } = await AccountModel.findById(creditAccountId)

            if (debitAccount === creditAccount) {
                const taxAmount = 0

                if (taxAmount > debitBalance) return res.json({ success: false, message: 'Insufficient Balance!', servicefee: tax, transferAmount: transferAmount, total: taxAmount })

                const debitFutureBalance = debitBalance - taxAmount
                const { _id: debitTransactionId } = await TransactionModel.create({ account: debitAccountId, fee: tax, amount: taxAmount, transactionType: 'transfer_debit', description: `${debitAccount} transferred to ${creditAccount}`, status: 'completed', balance: debitFutureBalance, token: token })
                const { _id: creditTransactionId } = await TransactionModel.create({ account: creditAccountId, fee: tax, amount: transferAmount, transactionType: 'transfer_credit', description: `Received from ${debitAccount}`, status: 'completed', balance: debitFutureBalance, token: token })
                await AccountModel.findByIdAndUpdate(debitAccountId, { balance: debitFutureBalance }, { new: true })

                Log({
                    userId: developerUserId,
                    action: 'create',
                    collectionName: 'Transaction',
                    documentId: debitTransactionId,
                    changes: { balance: debitFutureBalance },
                    description: `Foreign user: ${developerUserId} with developer document id of ${developerId} attempted to transfer. ${debitAccount} transferred an amount of ${transferAmount} with a service fee of ${tax}, totaling ${taxAmount}. The balance changed from ${debitBalance} to ${debitFutureBalance}.`
                })

                Log({
                    userId: developerUserId,
                    action: 'update',
                    collectionName: 'Transaction',
                    documentId: creditTransactionId,
                    changes: { balance: debitFutureBalance },
                    description: `Foreign user: ${developerUserId} with developer document id of ${developerId} attempted to transfer. ${creditAccount} credited an amount of ${transferAmount} The balance changed from ${creditBalance} to ${debitFutureBalance}`
                })
                return res.json({ success: true, message: 'Transfer transaction successfully!', reference: debitTransactionId })
            }

            const taxAmount = transferAmount + tax
            if (taxAmount > debitBalance) return res.json({ success: false, message: 'Insufficient Balance!', servicefee: tax, transferAmount: transferAmount, total: taxAmount })

            const debitFutureBalance = debitBalance - taxAmount
            const creditFutureBalance = creditBalance + transferAmount

            const { _id: debitTransactionId } = await TransactionModel.create({ account: debitAccountId, fee: tax, amount: taxAmount, transactionType: 'transfer_debit', description: `${debitAccount} transferred to ${creditAccount}`, status: 'completed', balance: debitFutureBalance, token: token })
            const { _id: creditTransactionId } = await TransactionModel.create({ account: creditAccountId, fee: tax, amount: transferAmount, transactionType: 'transfer_credit', description: `Received from ${debitAccount}`, status: 'completed', balance: creditFutureBalance, token: token })

            await AccountModel.findByIdAndUpdate(debitAccountId, { balance: debitFutureBalance }, { new: true })
            await AccountModel.findByIdAndUpdate(creditAccountId, { balance: creditFutureBalance }, { new: true })

            await Notify({
                user: debitUser,
                type: 'transfer_debit',
                content: `You have made a transaction with an IP Address of ${testIp}. You transferred an amount of ${amount} to ${creditAccount}. Transaction reference ${debitTransactionId}`
            })

            await Notify({
                user: creditUser,
                type: 'transfer_credit',
                content: `You have received an amount of ${amount} from ${debitAccount}.`
            })

            Log({
                userId: developerUserId,
                action: 'create',
                collectionName: 'Transaction',
                documentId: debitTransactionId,
                changes: { balance: debitFutureBalance },
                description: `Foreign user: ${developerUserId} with developer document id of ${developerId} attempted to transfer. ${debitAccount} transferred an amount of ${transferAmount} with a service fee of ${tax}, totaling ${taxAmount}. The balance changed from ${debitBalance} to ${debitFutureBalance}.`
            })

            Log({
                userId: developerUserId,
                action: 'update',
                collectionName: 'Transaction',
                documentId: creditTransactionId,
                changes: { balance: creditFutureBalance },
                description: `Foreign user: ${developerUserId} with developer document id of ${developerId} attempted to transfer. ${creditAccount} credited an amount of ${transferAmount} The balance changed from ${creditBalance} to ${creditFutureBalance}`
            })

            res.json({ success: true, message: 'Transfer transaction successfully!', reference: debitTransactionId })
        } catch (error) {
            res.json({ error: `TransferTransaction in transaction controller error ${error}` });
        }
    },
    GenerateUrl: async (req, res) => {
        try {
            const { accountno } = req.params
            const token = jwt.sign({ user: accountno }, process.env.ADMIN_TOKEN, { expiresIn: '1h' });
            const url = `${process.env.CLIENT_ADDRESS}/unionbank/myaccount?token=${token}`;
            res.json({ url });
        } catch (error) {
            res.json({ error: `GetAllTransaction in developer controller error ${error}` });
        }
    },
    GetAllUserTransaction: async (req, res) => {
        try {
            const { user } = req.user

            const { _id: accountId, accountno: accountno } = await AccountModel.findOne({ accountno: user })
            const data = await TransactionModel.find({ account: accountId })

            const formattedData = data.map(transaction => {
                const { createdAt, _id, amount, description, transactionType, balance, fee } = transaction;

                // Format date including time
                const formattedCreatedAt = new Date(createdAt).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return { _id, amount, description, createdAt: formattedCreatedAt, transactionType, balance, fee };
            });

            res.json({ success: true, message: 'Fetch transactions successfully!', data: formattedData, accountno })
        } catch (error) {
            res.json({ error: `GetAllTransaction in transaction controller error ${error}` });
        }
    },
    GetAllAuditLog: async (req, res) => {
        try {
            const data = await AuditLog.find()

            const formattedData = data.map(item => {
                const { _id, userId, action, collectionName, documentId, changes, description, createdAt } = item;

                const formattedCreatedAt = new Date(createdAt).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return { _id, userId, action, collectionName, documentId, changes, description, date: formattedCreatedAt, createdAt };
            });

            res.json({ success: true, message: 'Auditlog fetched successfully!', data: formattedData })
        } catch (error) {
            res.json({ error: `DeleteToken in developer controller error ${error}` });
        }
    },
    SearchAuditLog: async (req, res) => {
        try {
            const { searchId } = req.params

            const response = await fetch(`${process.env.REQUEST}/api/it/auditlog`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.ADMIN_TOKEN}`
                }
            })

            if (!response.ok) return res.json({ success: false, message: 'API Request error from search account controller!' })

            const audit = await response.json()
            const regex = new RegExp(searchId, 'i');

            // if (!searchId) { return res.json({ success: true, message: 'Fetched search account successfully!', data: accounts }) }

            const filteredData = audit?.data?.filter((item) => {
                const { userId } = item;
                return regex.test(userId)
            })

            res.json({ success: true, message: 'Auditlog fetched successfully!', data: filteredData })
        } catch (error) {
            res.json({ error: `SearchAuditLog in account controller error ${error}` });
        }
    },
    DeleteToken: async (req, res) => {
        try {
            const { tokenId } = req.params
            res.json({ success: true, message: 'Token deleted successfully!', tokenId })
        } catch (error) {
            res.json({ error: `DeleteToken in developer controller error ${error}` });
        }
    },
    BackUp: async (req, res) => {
        try {
            exec(`${mongodumpPath} --db ${dbName} --out ${dbName}backup`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing command: ${error}`);
                    return res.json({ success: false, message: 'Failed to backup database!' });
                }
                res.json({ success: true, message: 'Backup completed successfully!' });
            });
        } catch (error) {
            res.json({ success: false, message: `Error backup in developer controller: ${error}` });
        }
    },
    Restore: async (req, res) => {
        try {
            exec(`${mongorestorePath} ${dbName}backup`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error restoring backup: ${stderr}`);
                    return res.json({ success: false, message: `Error restoring backup: ${stderr}` });
                }
                res.json({ success: true, message: 'Restore completed successfully!' });
            });
        } catch (error) {
            res.json({ success: false, message: `Error restore controller: ${error}` });
        }
    },
    GetAllAnnouncement: async (req, res) => {
        try {
            const data = await AnnouncementModel.find()

            const formattedData = data.map(item => {
                const { _id, dateFrom, dateTo, content, createdAt } = item;

                const formattedDateFrom = new Date(dateFrom).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const formattedDateTo = new Date(dateTo).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return { _id, dateFrom: formattedDateFrom, dateTo: formattedDateTo, content };
            });

            res.json({ success: true, message: 'Announcements fetched successfully!', data: formattedData });
        } catch (error) {
            res.json({ success: false, message: `Error GetAllAnnouncement controller: ${error}` });
        }
    },
    CreateAnnouncement: async (req, res) => {
        try {
            const { dateFrom, dateTo, content } = req.body
            AnnouncementModel.create({ dateFrom, dateTo, content })
            res.json({ success: true, message: 'Announcement created successfully!' })
        } catch (error) {
            res.json({ success: false, message: `Error create announcement controller: ${error}` });
        }
    },
    UpdateAnnouncement: async (req, res) => {
        try {

            res.json({ success: true, message: 'Restore completed successfully!' })
        } catch (error) {
            res.json({ success: false, message: `Error create announcement controller: ${error}` });
        }
    },
    DeleteAnnouncement: async (req, res) => {
        try {
            const { announcementId } = req.body
            await AnnouncementModel.findByIdAndDelete(announcementId)
            res.json({ success: true, message: 'Announcement deleted successfully!' })
        } catch (error) {
            res.json({ success: false, message: `Error create announcement controller: ${error}` });
        }
    },
    GetUserNotification: async (req, res) => {
        try {
            const { userId } = req.params

            const data = await NotificationModel.find({ user: userId })
            res.json({ success: true, message: 'Notifications fetched successfully!', data })
        } catch (error) {
            res.json({ success: false, message: `Error GetUserNotification in developers controller: ${error}` });
        }
    }
}

module.exports = DeveloperController