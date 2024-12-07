const TransactionModel = require('../models/Transactions.model')
const AccountModel = require('../models/Account.model')
const AuditLog = require('../models/Auditlog.model')
const NotificationModel = require('../models/Notifications.model')

const Log = async ({ userId, action, collectionName, documentId, changes, description }) => {
    await AuditLog.create({ userId, action, collectionName, documentId, changes, description })
}

const Notify = async ({ user, type, content }) => {
    await NotificationModel.create({ user, type, content })
}

const TransactionController = {
    DepositTransaction: async (req, res) => {
        try {
            const userIdHeader = req.headers['userid']

            const { account, amount } = req.body
            const depositAmount = parseFloat(amount)

            const { _id: accountId, userId } = await AccountModel.findOne({ accountno: account })

            const { balance } = await AccountModel.findById(accountId)

            const currentBalance = balance + depositAmount

            const { _id: creditTransactionId } = await TransactionModel.create({ account: accountId, fee: 0, amount: depositAmount, transactionType: 'deposit', balance: currentBalance, token: `UnionBank userid : ${userIdHeader}`, description: 'Deposited from UnionBank' })
            await AccountModel.findByIdAndUpdate(accountId, { balance: currentBalance }, { new: true })

            await Notify({
                user: userId,
                type: 'deposit',
                content: `You have made a deposit with an amount of ${amount} from UnionBank.`
            })

            await Log({
                userId: userIdHeader,
                action: 'create',
                collectionName: 'Transaction',
                documentId: creditTransactionId,
                changes: { balance: currentBalance },
                description: `${account} attempted a deposit with an amount of ${amount} with a service fee of 0. The balance changed from ${balance} to ${currentBalance}.`
            })

            res.json({ success: true, message: 'Deposit transaction successfully!', balance: currentBalance })
        } catch (error) {
            res.json({ success: false, message: 'DepositTransaction in transaction controller error', error })
        }
    },
    WithdrawTransaction: async (req, res) => {
        try {
            const userIdHeader = req.headers['userid']

            const { account, amount } = req.body
            const withdrawAmount = parseFloat(amount)
            const tax = 0

            const { _id: accountId, userId } = await AccountModel.findOne({ accountno: account })
            const { balance } = await AccountModel.findById(accountId)

            const taxAmount = withdrawAmount + tax

            if (taxAmount > balance) return res.json({ success: false, message: 'Insufficient Balance', balance: balance, taxPayable: tax, total: taxAmount })

            const currentBalance = balance - taxAmount

            const { _id: debitTransactionId } = await TransactionModel.create({ account: accountId, fee: tax, amount: withdrawAmount, transactionType: 'withdrawal', balance: currentBalance, token: `UnionBank userid : ${userIdHeader}`, description: 'Withdrawed from UnionBank' })
            await AccountModel.findByIdAndUpdate(accountId, { balance: currentBalance }, { new: true })

            await Notify({
                user: userId,
                type: 'withdrawal',
                content: `You have made a withdrawal with an amount of ${amount} from UnionBank.`
            })

            await Log({
                userId: userIdHeader,
                action: 'create',
                collectionName: 'Transaction',
                documentId: debitTransactionId,
                changes: { balance: currentBalance },
                description: `${account} attempted a withdrawal with an amount of ${amount} with a service fee of ${tax}, totaling ${taxAmount}. The balance changed from ${balance} to ${currentBalance}.`
            })

            res.json({ success: true, message: 'Withdrawal transaction successfully!' })
        } catch (error) {
            res.json({ success: false, message: 'WithdrawTransaction in transaction controller error', error })
        }
    },
    TransferTransaction: async (req, res) => {
        try {
            const userIdHeader = req.headers['userid']

            const { debitAccount, creditAccount, amount } = req.body

            const transferAmount = parseFloat(amount)
            const tax = 10

            const { _id: debitAccountId, userId: debitUser } = await AccountModel.findOne({ accountno: debitAccount })
            const { _id: creditAccountId, userId: creditUser } = await AccountModel.findOne({ accountno: creditAccount })

            const { balance: debitBalance } = await AccountModel.findById(debitAccountId)
            const { balance: creditBalance } = await AccountModel.findById(creditAccountId)

            if (debitAccount === creditAccount) {
                const taxAmount = 0

                if (taxAmount === debitBalance) return res.json({ success: false, message: 'Insufficient Balance!', balance: debitBalance, taxPayable: tax, debitAmount: transferAmount, total: taxAmount })

                const debitFutureBalance = debitBalance - taxAmount
                const { _id: debitTransactionId } = await TransactionModel.create({ account: debitAccountId, fee: tax, amount: transferAmount, transactionType: 'transfer_debit', description: `Transferred to ${creditAccount}`, status: 'completed', balance: debitFutureBalance, token: `Retail Banking : ${userIdHeader}` })

                await AccountModel.findByIdAndUpdate(debitAccountId, { balance: debitFutureBalance }, { new: true })

                await Notify({
                    user: debitUser,
                    type: 'transfer_debit',
                    content: `You have made a transaction. You transferred from UnionBank with an amount of ${amount} to ${creditAccount}.`
                })

                await Notify({
                    user: creditUser,
                    type: 'transfer_credit',
                    content: `You have received an amount of ${amount} from ${debitAccount}.`
                })

                await Log({
                    userId: userIdHeader,
                    action: 'create',
                    collectionName: 'Transaction',
                    documentId: debitTransactionId,
                    changes: { balance: debitFutureBalance },
                    description: `${debitAccount} transferred an amount of ${transferAmount} with a service fee of ${tax}, totaling ${taxAmount}. The balance changed from ${debitBalance} to ${debitFutureBalance}.`
                })

                await Log({
                    userId: userIdHeader,
                    action: 'update',
                    collectionName: 'Transaction',
                    documentId: debitTransactionId,
                    changes: { balance: debitFutureBalance },
                    description: `${creditAccount} credited an amount of ${transferAmount} The balance changed from ${creditBalance} to ${debitFutureBalance}`
                })

                return res.json({ success: true, message: 'Transfer transaction successfully!', reference: debitTransactionId })
            }

            const taxAmount = transferAmount + tax
            if (taxAmount > debitBalance) return res.json({ success: false, message: 'Insufficient Balance!', balance: debitBalance, taxPayable: tax, debitAmount: transferAmount, total: taxAmount })

            const debitFutureBalance = debitBalance - taxAmount
            const creditFutureBalance = creditBalance + transferAmount

            const { _id: debitTransactionId } = await TransactionModel.create({ account: debitAccountId, fee: tax, amount: transferAmount, transactionType: 'transfer_debit', description: `Transferred to ${creditAccount}`, status: 'completed', balance: debitFutureBalance, token: `Retail Banking : ${userIdHeader}` })
            const { _id: creditTransactionId } = await TransactionModel.create({ account: creditAccountId, fee: tax, amount: transferAmount, transactionType: 'transfer_credit', description: `Received from ${debitAccount}`, status: 'completed', balance: creditFutureBalance, token: `Retail Banking : ${userIdHeader}` })

            await AccountModel.findByIdAndUpdate(debitAccountId, { balance: debitFutureBalance }, { new: true })
            await AccountModel.findByIdAndUpdate(creditAccountId, { balance: creditFutureBalance }, { new: true })

            await Notify({
                user: debitUser,
                type: 'transfer_debit',
                content: `You have made a transaction. You transferred from UnionBank with an amount of ${amount} to ${creditAccount}.`
            })

            await Notify({
                user: creditUser,
                type: 'transfer_credit',
                content: `You have received an amount of ${amount} from ${debitAccount}.`
            })

            await Log({
                userId: userIdHeader,
                action: 'create',
                collectionName: 'Transaction',
                documentId: debitTransactionId,
                changes: { balance: debitFutureBalance },
                description: `${debitAccount} transferred an amount of ${transferAmount} with a service fee of ${tax}, totaling ${taxAmount}. The balance changed from ${debitBalance} to ${debitFutureBalance}.`
            })

            await Log({
                userId: userIdHeader,
                action: 'update',
                collectionName: 'Transaction',
                documentId: creditTransactionId,
                changes: { balance: creditFutureBalance },
                description: `${creditAccount} credited an amount of ${transferAmount} The balance changed from ${creditBalance} to ${creditFutureBalance}`
            })

            res.json({ success: true, message: 'Transfer transaction successfully!', reference: debitTransactionId })
        } catch (error) {
            res.json({ success: false, message: 'TransferTransaction in transaction controller error', error })
        }
    },
    GetAllTransaction: async (req, res) => {
        try {
            const data = await TransactionModel.find()

            const formattedData = data.map(transaction => {
                const { createdAt, _id, amount, description, transactionType } = transaction;
                const formattedCreatedAt = new Date(createdAt).toLocaleDateString('en-US');
                return { _id, amount, description, createdAt: formattedCreatedAt, transactionType };
            });

            res.json({ success: true, message: 'Fetch transactions successfully!', data: formattedData })
        } catch (error) {
            res.json({ success: false, message: 'GetAllTransaction in transaction controller error', error });
        }
    },
    GetAllUserTransaction: async (req, res) => {
        try {
            const { userId } = req.params
            const { _id: accountId } = await AccountModel.findOne({ userId: userId })

            if (accountId === null) return res.json({ success: false, message: 'No Account' })

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

            res.json({ success: true, message: 'Fetch transactions successfully!', data: formattedData })
        } catch (error) {
            res.json({ success: false, message: 'GetAllUserTransaction in transaction controller error', error });
        }
    },
    SearchTransaction: async (req, res) => {
        try {
            const { searchId } = req.params

            const { createdAt, _id, amount, description, transactionType, balance, fee } = await TransactionModel.findById(searchId)
            const formattedCreatedAt = new Date(createdAt).toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            res.json({ success: true, message: 'Fethced certain account successfully!', data: [{ _id, amount, description, createdAt: formattedCreatedAt, transactionType, balance, fee }] })
        } catch (error) {
            res.json({ success: false, message: 'SearchTransaction in transaction controller error', error })
        }
    },

    HighestTransaction: async (req, res) => {
        try {
            // Find the highest deposit
            const highestDeposit = await TransactionModel.findOne({ transactionType: 'deposit' })
                .sort({ amount: -1 }) // Sort in descending order of amount
                .limit(1); // Get only the top record
    
            // Find the highest withdrawal
            const highestWithdrawal = await TransactionModel.findOne({ transactionType: 'withdrawal' })
                .sort({ amount: -1 }) // Sort in descending order of amount
                .limit(1); // Get only the top record
    
            res.json({
                success: true,
                message: 'Fetched highest transactions successfully!',
                data: {
                    highestDeposit: highestDeposit
                        ? {
                              amount: highestDeposit.amount,
                              description: highestDeposit.description,
                              createdAt: highestDeposit.createdAt,
                          }
                        : null,
                    highestWithdrawal: highestWithdrawal
                        ? {
                              amount: highestWithdrawal.amount,
                              description: highestWithdrawal.description,
                              createdAt: highestWithdrawal.createdAt,
                          }
                        : null,
                },
            });
        } catch (error) {
            res.json({
                success: false,
                message: 'Error fetching highest transactions',
                error,
            });
        }
    },
    

}

module.exports = TransactionController