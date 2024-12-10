import { GetAllAnnouncement } from '@/api/Admin'
import { fetchCredentials } from '@/api/Credentials'
import Maintenance from '@/components/__tests__/Maintenance'
import Announcement from '@/components/Announcement'
import Header__Home from '@/components/Header__Home'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DragCards } from '@/components/Cards'


export default function Showcase() {
    const navigate = useNavigate()
    // const [announcement, setAnnouncement] = useState('')

    const { data: credentials = '', isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['showcaseCredentials']
    })

    const { data: fetchAnnouncements = [], isLoading: announcementLoading } = useQuery({
        queryFn: () => GetAllAnnouncement(),
        queryKey: ['showcasegetAnnouncements'],
        refetchInterval: 5000
    })

    useEffect(() => {
        if (credentials && !credentialsLoading) { navigate('/') }
        if (!announcementLoading && fetchAnnouncements.length > 0) {
            sessionStorage.clear()
            navigate('/unionbank')
            return
        }
    }, [credentials, navigate])

    return (
        <>
            {
                fetchAnnouncements.length > 0 &&
                <Maintenance dateFrom={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} dateTo={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} content={fetchAnnouncements[fetchAnnouncements.length - 1]?.content || ''} />
            }

            <div className='relative overflow-x-hidden w-full h-screen flex justify-start items-center flex-col bg-[#121212]'>
                <Header__Home />
                <Announcement color={`#000000`} />
                <div className="w-full flex flex-col justify-evenly items-center relative">
                    <div className="w-full flex flex-col justify-start items-start">
                        <div className="w-full h-screen flex justify-center items-center">
                            <DragCards />
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}
