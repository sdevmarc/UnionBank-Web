const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env
import axios from 'axios'

export const fetchUserTransactions = async ({ userId }) => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/transactions/${userId}`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        if (!res?.data?.success) return []

        const transactions = res?.data?.data
        const formattedData = transactions.map((trans, index) => ({
            id: index + 1,
            date: trans?.createdAt,
            reference: trans?._id,
            debit: trans?.amount,
            credit: trans?.amount,
            servicefee: trans?.fee,
            description: trans?.description,
            transactionType: trans?.transactionType,
            balance: trans?.balance
        }))

        return formattedData
    } catch (error) {
        console.error(error)
    }
}

export const fetchTransfer = async ({ debitAccount, creditAccount, amount, token, userId }) => {
    try {
        const res = await axios.post(`${VITE_HOST}/api/transfertransaction`, { debitAccount, creditAccount, amount }, {
            headers: {
                Authorization: `Bearer ${token}`,
                userId: userId
            }
        })
        return res?.data
    } catch (error) {
        console.error(error)
    }
}

export const makeDeposit = async ({ account, amount, userId }) => {
    try {
        const res = await axios.post(`${VITE_HOST}/api/deposittransaction`, { account, amount }, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`,
                userId: userId
            }
        })
        console.log(res?.data)
        return res?.data
    } catch (error) {
        console.error(error)
    }
}