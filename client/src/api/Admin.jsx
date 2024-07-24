const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env
import axios from 'axios'


export const CreateAnnouncement = async ({ dateFrom, dateTo, content }) => {
    try {
        const res = await axios.post(`${VITE_HOST}/api/createannouncement`, { dateFrom, dateTo, content }, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        return res?.data
    } catch (error) {
        console.error(error)
    }
}

export const DeleteAnnouncement = async ({ announcementId }) => {
    try {
        const res = await axios.post(`${VITE_HOST}/api/deleteannouncement`, { announcementId }, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        return res?.data
    } catch (error) {
        console.error(error)
    }
}

export const GetAllAnnouncement = async () => {
    try {
        const res = await axios.get(`${VITE_HOST}/api/announcements`, {
            headers: {
                Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
            }
        })

        if (!res?.data?.success) return null

        const announcements = res?.data?.data
        const formattedData = announcements.map((acc, index) => ({
            id: index + 1,
            uid: acc?._id,
            dateFrom: acc?.dateFrom,
            dateTo: acc?.dateTo,
            content: acc?.content
        }))


        return formattedData
    } catch (error) {
        console.error(error)
    }
}