const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env
import axios from 'axios'

export const fetchCredentials = () => {
    try {
        const credentialsString = sessionStorage.getItem('credentials')
        // if (!credentialsString) {
        //     return null
        // }
        const data = JSON.parse(credentialsString)
        return data
    } catch (error) {
        console.error('Error fetching credentials:', error)
        return null
    }
}

export const fetchTokens = async ({ userId }) => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/tokens/${userId}`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })
        if (!res?.data?.success) return null
        return res?.data?.data
    } catch (error) {
        console.error(error)
    }
}

export const API_CreateToken = async ({ userId }) => {
    try {
        const res = await axios.post(`${VITE_HOST}/api/createdevelopertoken/${userId}`, {}, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })
        return res?.data
    } catch (error) {
        console.error(error)
    }
}