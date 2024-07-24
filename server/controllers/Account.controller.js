const AccountModel = require('../models/Account.model')
const AuditLog = require('../models/Auditlog.model')
const fetch = require('node-fetch')

const Log = async ({ userId, action, collectionName, documentId, changes, description }) => {
    await AuditLog.create({ userId, action, collectionName, documentId, changes, description })
}

const AccountController = {
    CreateAccount: async (req, res) => {
        try {
            const { accno } = req
            const { userId, accountType, rbid } = req.body

            const data = await AccountModel.create({ userId, accountno: accno, accountType })

            if (rbid !== undefined) {
                Log({
                    userId: rbid,
                    action: 'create',
                    collectionName: 'Account',
                    documentId: data?._id,
                    changes: {
                        userId: userId,
                        accountno: accno,
                        accountType: accountType
                    },
                    description: `Attempted to open an account for: ${data?._id}`
                })
            }
            res.json({ success: true, message: 'Account created successfully!', data })
        } catch (error) {
            res.json({ error: `CreateAccount in account controller error ${error}` });
        }
    },
    GetAllAccount: async (req, res) => {
        try {
            const data = await AccountModel.find()
            res.json({ success: true, message: 'Fetch accounts successfully!', data })
        } catch (error) {
            res.json({ error: `GetAllAccount in account controller error ${error}` });
        }
    },
    GetUserAccount: async (req, res) => {
        try {
            const { uid } = req.params
            
            const { _id, userId, accountno, accountType, balance, isactive } = await AccountModel.findOne({ userId: uid })

            const formattedBalance = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(balance);
           
            res.json({ success: true, message: 'Fetch accounts successfully!', data: { _id, userId, accountno, accountType, balance: formattedBalance, isactive } });

            // res.json({ success: true, message: 'Fetch accounts successfully!', data: { _id, userId, accountno, accountType, balance: formattedBalance, isactive } })
        } catch (error) {
            res.json({ error: `GetUserAccount in account controller error ${error}` });
        }
    },
    SearchAccount: async (req, res) => {
        try {
            const { searchId } = req.params

            const response = await fetch(`${process.env.REQUEST}/api/rbaccounts`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.ADMIN_TOKEN}`
                }
            })

            if (!response.ok) return res.json({ success: false, message: 'API Request error from search account controller!' })

            const accounts = await response.json()
            const regex = new RegExp(searchId, 'i');

            // if (!searchId) { return res.json({ success: true, message: 'Fetched search account successfully!', data: accounts }) }

            const filteredData = accounts?.data?.filter((item) => {
                const { accountno, user } = item;
                const { name } = user;
                return regex.test(accountno) || regex.test(name);
            })

            // For Specific datas only
            // .map((item) => {
            //     const { accountno, user } = item;
            //     const { name } = user;
            //     return { accountno, name };
            // });

            res.json({ success: true, message: 'Fethced certain account successfully!', data: filteredData })
        } catch (error) {
            res.json({ error: `SearchAccount in account controller error ${error}` });
        }
    },
    UpdateAccount: async (req, res) => {
        try {
            const { accountId } = req.params
            const values = req.body

            res.json({ success: true, message: 'Account updated successfully!', values, accountId })
        } catch (error) {
            res.json({ error: `UpdateAccount in account controller error ${error}` });
        }
    },
    UpdateActiveAccount: async (req, res) => {
        try {
            const { accountId } = req.params
            const { isactive, rbid } = req.body

            const data = await AccountModel.findByIdAndUpdate(
                accountId,
                { isactive: isactive },
                { new: true }
            )

            if (rbid !== undefined) {
                Log({
                    userId: rbid,
                    action: 'update',
                    collectionName: 'Account',
                    documentId: data?._id,
                    changes: {
                        isactive: isactive
                    },
                    description: `Attempted to update isactive of an account for: ${data?.userId}`
                })
            }
            res.json({ success: true, message: 'Account active updated successfully!', data })
        } catch (error) {
            res.json({ error: `UpdateActiveAccount in account controller error ${error}` });
        }
    }
}

module.exports = AccountController