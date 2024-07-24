const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env
import axios from 'axios'

export const ANALYTICS_HR = async () => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/analytics/hr`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })
        return res?.data
    } catch (error) {
        console.error(error)
    }
}

export const ANALYTICS_RB = async () => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/analytics/rb`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        return res?.data
    } catch (error) {
        console.error(error)
    }
}