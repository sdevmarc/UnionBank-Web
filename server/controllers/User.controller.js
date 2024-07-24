const AccountModel = require('../models/Account.model')
const UserModel = require('../models/Users.model')
const TransactionModel = require('../models/Transactions.model')
const AuditLog = require('../models/Auditlog.model')
const fetch = require('node-fetch')

const Log = async ({ userId, action, collectionName, documentId, changes, description }) => {
    await AuditLog.create({ userId, action, collectionName, documentId, changes, description })
}

const UserController = {
    CreateUser: async (req, res) => {
        try {
            const { name, email, mobileno, password, role, rbid } = req.body

            const data = await UserModel.create({ name, email, mobileno, password, role })

            if (rbid !== undefined) {
                Log({
                    userId: rbid,
                    action: 'create',
                    collectionName: 'User',
                    documentId: data?._id,
                    changes: {
                        name: name,
                        email: email,
                        mobileno: mobileno,
                        role: role
                    },
                    description: `Attempted to create a user: ${data?.email}`
                })
            }

            res.json({ success: true, message: 'User created successfully!', data: data?._id })
        } catch (error) {
            res.json({ error: `CreateUser in user controller error ${error}` });
        }
    },
    GetAllUsers: async (req, res) => {
        try {
            const data = await UserModel.find()
            res.json({ success: true, message: 'Fetch user successfully!', data })
        } catch (error) {
            res.json({ error: `GetAllUser in user controller error ${error}` });
        }
    },
    GetAllDeveloperUsers: async (req, res) => {
        try {
            const data = await UserModel.find({ role: 'developer' });
            res.json({ success: true, message: 'Fetch employed users successfully!', data })
        } catch (error) {
            res.json({ error: `GetAllEmployedUsers in user controller error ${error}` });
        }
    },
    GetAllEmployedUsers: async (req, res) => {
        try {
            const data = await UserModel.find({ role: { $nin: ['user', 'developer'] } });
            res.json({ success: true, message: 'Fetch employed users successfully!', data })
        } catch (error) {
            res.json({ error: `GetAllEmployedUsers in user controller error ${error}` });
        }
    },
    GetAllRBUsers: async (req, res) => {
        try {
            const usersWithoutAccounts = await UserModel.aggregate([
                // Match users with role 'user'
                { $match: { role: { $in: ['user', 'developer'] } } },

                // Lookup accounts associated with each user
                {
                    $lookup: {
                        from: 'accounts',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'accounts',
                    },
                },

                // Match users who do not have any accounts
                { $match: { accounts: { $size: 0 } } },

                // Project the fields to include in the result
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        mobileno: 1,
                        isactive: 1,
                        role: 1,
                    },
                },
            ]);


            res.json({ success: true, message: 'Fetch user successfully!', data: usersWithoutAccounts })
        } catch (error) {
            res.json({ error: `GetAllRBUser in user controller error ${error}` });
        }
    },
    GetAllRBAccounts: async (req, res) => {
        try {
            const AccountUsers = await AccountModel.aggregate([
                // Lookup users associated with each account
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                    },
                },

                // Unwind the user array to de-normalize the data
                { $unwind: '$user' },

                // Project the fields to include in the result
                {
                    $project: {
                        _id: 1,
                        accountno: 1,
                        accountType: 1,
                        balance: 1,
                        isactive: 1,
                        user: {
                            _id: '$user._id',
                            name: '$user.name',
                            email: '$user.email',
                            mobileno: '$user.mobileno',
                            isactive: '$user.isactive',
                            isdeveloper: '$user.isdeveloper',
                        },
                    },
                },
            ]);

            res.json({ success: true, message: 'Fetch user successfully!', data: AccountUsers })
        } catch (error) {
            res.json({ error: `GetAllRBAccounts in user controller error ${error}` });
        }
    },
    GetCurrentUser: async (req, res) => {
        try {
            const { userId } = req.params

            const { name, email, mobileno, role, isactive } = await UserModel.findById(userId)

            res.json({ success: true, message: 'Fetched certain user successfully!', data: { name, email, mobileno, role, isactive } })
        } catch (error) {
            res.json({ error: `GetCurrentUser in user controller error ${error}` });
        }
    },
    SearchDeveloperUsers: async (req, res) => {
        try {
            const { searchId } = req.params

            const response = await fetch(`${process.env.REQUEST}/api/developerusers`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.ADMIN_TOKEN}`
                }
            })

            if (!response.ok) return res.json({ success: false, message: 'API Request error from search all developer in user controller!' })

            const developers = await response.json()
            const regex = new RegExp(searchId, 'i');

            const formattedData = developers?.data?.filter((item) => {
                const { name, email, _id, user } = item
                return regex.test(name) || regex.test(email) || regex.test(_id) || regex.test(user)
            })

            res.json({ success: true, message: 'Fetched certain user successfully!', data: formattedData })
        } catch (error) {
            res.json({ error: `SearchDeveloperUsers in user controller error ${error}` });
        }
    },
    SearchEmployedUsers: async (req, res) => {
        try {
            const { searchId } = req.params

            const response = await fetch(`${process.env.REQUEST}/api/employedusers`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.ADMIN_TOKEN}`
                }
            })

            if (!response.ok) return res.json({ success: false, message: 'API Request error from search user controller!' })

            const employees = await response.json()
            const regex = new RegExp(searchId, 'i');

            const formattedData = employees?.data?.filter((item) => {
                const { name, email, mobileno, _id } = item
                return regex.test(name) || regex.test(email) || regex.test(mobileno) || regex.test(_id)
            })

            res.json({ success: true, message: 'Fetched certain user successfully!', data: formattedData })
        } catch (error) {
            res.json({ error: `SearchEmployedUsers in user controller error ${error}` });
        }
    },
    SearchRBUser: async (req, res) => {
        try {
            const { searchId } = req.params

            const response = await fetch(`${process.env.REQUEST}/api/rbusers`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.ADMIN_TOKEN}`
                }
            })

            if (!response.ok) return res.json({ success: false, message: 'API Request error from search rb user controller!' })

            const rbusers = await response.json()
            const regex = new RegExp(searchId, 'i');

            const formattedUsers = rbusers?.data?.filter((item) => {
                const { name, email, mobileno, _id } = item
                return regex.test(name) || regex.test(email) || regex.test(mobileno) || regex.test(_id)
            })

            res.json({ success: true, message: 'Fetched certain user successfully!', data: formattedUsers })
        } catch (error) {
            res.json({ error: `SearchRBUser in user controller error ${error}` });
        }
    },
    SearchRBAccounts: async (req, res) => {
        try {
            const { searchId } = req.params

            const response = await fetch(`${process.env.REQUEST}/api/rbaccounts`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.ADMIN_TOKEN}`
                }
            })

            if (!response.ok) return res.json({ success: false, message: 'API Request error from search user controller!' })

            const rbaccounts = await response.json()
            const regex = new RegExp(searchId, 'i');

            const formattedAccounts = rbaccounts?.data?.filter((item) => {
                const { accountno, user, _id } = item
                const { name, email, mobileno } = user
                return regex.test(name) || regex.test(email) || regex.test(mobileno) || regex.test(accountno) || regex.test(_id)
            })

            res.json({ success: true, message: 'Fetched certain user successfully!', data: formattedAccounts })
        } catch (error) {
            res.json({ error: `SearchRBAccounts in user controller error ${error}` });
        }
    },
    UpdateUser: async (req, res) => {
        try {
            const { userId } = req.params
            const { name, email, mobileno, role, rbid } = req.body

            const data = await UserModel.findByIdAndUpdate(
                userId,
                {
                    name: name,
                    email: email,
                    mobileno: mobileno,
                    role: role
                },
                { new: true }
            )

            const description = rbid === undefined
                ? `Attempted to update its profile`
                : `Attempted to update the profile of ${data?.email}`

            Log({
                userId: rbid || userId,
                action: 'update',
                collectionName: 'User',
                documentId: data?._id,
                changes: {
                    name: name,
                    email: email,
                    mobileno: mobileno,
                    role: role
                },
                description: description
            });

            res.json({ success: true, message: 'User updated successfully', data })
        } catch (error) {
            res.json({ error: `UpdateUser in user controller error ${error}` });
        }
    },
    UpdateActiveUser: async (req, res) => {
        try {
            const { userId } = req.params
            const { isactive, rbid } = req.body

            const data = await UserModel.findByIdAndUpdate(userId, { isactive: isactive }, { new: true })

            const defaultDescription = `Attempted to update its profile`
            const detailedDescription = `Attempted to update the profile of ${data?.email}`

            if (rbid === undefined) {
                Log({
                    userId: userId,
                    action: 'update',
                    collectionName: 'User',
                    documentId: data?._id,
                    changes: { isactive: isactive },
                    description: defaultDescription
                })
            } else {
                Log({
                    userId: rbid,
                    action: 'update',
                    collectionName: 'User',
                    documentId: data?._id,
                    changes: { isactive: isactive },
                    description: detailedDescription
                })
            }

            res.json({ success: true, message: 'User active updated successfully!', data })
        } catch (error) {
            res.json({ error: `UpdateActiveUser in user controller error ${error}` });
        }
    },
    Analytics_HumanResource: async (req, res) => {
        try {
            const quantity_admin = await UserModel.countDocuments({ role: 'admin' })
            const quantity_hr = await UserModel.countDocuments({ role: 'hr' })
            const quantity_rb = await UserModel.countDocuments({ role: 'rb' })
            const quantity_it = await UserModel.countDocuments({ role: 'it' })

            const data = {
                admin: quantity_admin,
                hr: quantity_hr,
                rb: quantity_rb,
                it: quantity_it,
            };

            res.json({ success: true, message: 'Human resource analytics fetched!', data })
        } catch (error) {
            res.json({ success: false, message: 'Error in Analytics_HumanResource!', error })
        }
    },
    Analytics_RB: async (req, res) => {
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            // Aggregate transactions within the last 7 days
            const dailyTransactions = await TransactionModel.aggregate([
                {
                    $match: {
                        createdAt: { $gte: sevenDaysAgo },
                        status: 'completed', // Only consider completed transactions
                        transactionType: { $in: ['deposit', 'withdrawal'] } // Only deposits and withdrawals
                    }
                },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            transactionType: "$transactionType"
                        },
                        totalAmount: { $sum: "$amount" }
                    }
                },
                {
                    $sort: { "_id.date": 1 } // Sort by date
                }
            ]);

            // Format the response
            const formattedData = dailyTransactions.reduce((acc, item) => {
                const { date, transactionType } = item._id;
                if (!acc[date]) {
                    acc[date] = { date, deposit: 0, withdrawal: 0 };
                }
                acc[date][transactionType] = item.totalAmount;
                return acc;
            }, {});

            res.json({
                success: true,
                message: 'Daily transaction amounts for deposits and withdrawals fetched!',
                data: Object.values(formattedData)
            });
        } catch (error) {
            res.json({ success: false, message: 'Error in Analytics_RB!', error })
        }
    }
}

module.exports = UserController