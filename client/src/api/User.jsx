const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env
import axios from 'axios'

export const fetchLoginUser = async ({ email, password }) => {
    try {
        const res = await axios.post(`${VITE_HOST}/api/loginuser`, { email, password }, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        return res?.data
    } catch (error) {
        console.error(error)
    }
}

export const fetchOtp = async ({ otp }) => {
    try {
        const res = await axios.post(`${VITE_HOST}/api/verify`, {
            otp: otp
        }, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })
        return res?.data
    } catch (error) {
        console.error(error)
    }
}

export const fetchSignUp = async ({ name, email, mobileno, password }) => {
    try {
        console.log('asdasd', { name, email, mobileno, password })
        const res = await axios.post(`${VITE_HOST}/api/createuser`, { name, email, mobileno, password }, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })
        return res?.data
    } catch (error) {
        console.error(error)
    }
}

export const fetchProfileDetails = async ({ userId }) => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        return res?.data?.data
    } catch (error) {
        console.error(error)
    }
}

export const UpdateProfileUser = async ({ userId, name, email, mobileno, role }) => {
    try {
        const res = await axios.post(`${VITE_HOST}/api/updateuser/${userId}`, { name, email, mobileno, role }, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })
        return res?.data
    } catch (error) {
        console.error(error)
    }
}

export const fetchRBUsers = async () => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/rbusers`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        const users = res?.data?.data
        const formattedData = users.map((user, index) => ({
            id: index + 1,
            uid: user?._id,
            name: user?.name,
            email: user?.email,
            mobileno: user?.mobileno,
            isactive: user?.isactive
        }))
        return formattedData
    } catch (error) {
        console.error(error)
    }
}

export const SearchRBUsers = async (search) => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/searchrbusers/${search}`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        const users = res?.data?.data

        const formattedData = users.map((user, index) => ({
            id: index + 1,
            uid: user?._id,
            name: user?.name,
            email: user?.email,
            mobileno: user?.mobileno,
            isactive: user?.isactive
        }))

        return formattedData
    } catch (error) {
        console.error(error)
    }
}

export const fetchNotifications = async ({ userId }) => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/notifications/${userId}`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`,
            }
        })

        if (!res?.data?.success) return null
        return res?.data?.data

    } catch (error) {
        console.error(error)
    }
}