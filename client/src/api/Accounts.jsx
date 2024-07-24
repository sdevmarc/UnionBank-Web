const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env
import axios from 'axios'

export const fetchAccount = async ({ userId }) => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/useraccount/${userId}`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        if (res?.data?.success) return res?.data?.data
        return null
    } catch (error) {
        console.error(error)
    }
}

export const fetchRBAccounts = async () => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/rbaccounts`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })
        const accounts = res?.data?.data
        const formattedData = accounts.map((acc, index) => ({
            id: index + 1,
            uid: acc?.user?._id,
            accountno: acc?.accountno,
            name: acc?.user?.name,
            balance: acc?.balance
        }))
        return formattedData
    } catch (error) {
        console.error(error)
    }
}

export const SearchRbAccounts = async (e) => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/accounts/${e}`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })
        const accounts = res?.data?.data
        const formattedData = accounts.map((acc, index) => ({
            id: index + 1,
            uid: acc?.user?._id,
            accountno: acc?.accountno,
            name: acc?.user?.name,
            balance: acc?.balance
        }))
        return formattedData
    } catch (error) {
        console.error(error)
    }
}

export const CustomerfetchRBAccounts = async () => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/rbaccounts`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        const RBaccounts = res?.data?.data
        const formattedData = RBaccounts.map((acc, index) => ({
            id: index + 1,
            uid: acc?._id,
            accountno: acc?.accountno,
            name: acc?.user?.name,
            email: acc?.user?.email,
            mobileno: acc?.user?.mobileno,
            accountactive: acc?.isactive
        }))
        return formattedData
    } catch (error) {
        console.error(error)
    }
}

export const CustomersSearchRBAccounts = async (search) => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/searchrbaccounts/${search}`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        const RBaccounts = res?.data?.data
        const formattedData = RBaccounts.map((acc, index) => ({
            id: index + 1,
            uid: acc?._id,
            accountno: acc?.accountno,
            name: acc?.user?.name,
            email: acc?.user?.email,
            mobileno: acc?.user?.mobileno,
            accountactive: acc?.isactive
        }))

        return formattedData
    } catch (error) {
        console.error(error)
    }
}