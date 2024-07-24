import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header__Home from '../../components/Header__Home'
import SolanaPic from '../../assets/SolanaPic.webp'
import { useQuery } from '@tanstack/react-query'
import { fetchCredentials } from '@/api/Credentials'
import Maintenance from '@/components/__tests__/Maintenance'
import { GetAllAnnouncement } from '@/api/Admin'

export default function Home() {
    const navigate = useNavigate()

    const { data: credentials = '', isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['homeCredentials']
    })

    const { data: fetchAnnouncements = [], isLoading: announcementLoading } = useQuery({
        queryFn: () => GetAllAnnouncement(),
        queryKey: ['homegetAnnouncements'],
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

            <div className='w-full h-screen flex justify-start items-center flex-col bg-[#121212]'>
                <Header__Home />
                <div className="overflow-hidden w-full h-full flex flex-col justify-evenly items-center relative">
                    <img src={SolanaPic} alt="Solana Pic" className='absolute top-[-2rem] left-[30rem] sm:left-[25rem] md:left-[20rem] lg:-left-[15rem] w-[20rem] h-[10rem] scale-[5]' />
                    <img src={SolanaPic} alt="Solana Pic" className='absolute top-[10rem] right-[-30rem] sm:right-[-25rem] md:right-[-20rem] lg:right-[-15rem] w-[20rem] h-[10rem] scale-[5]' />
                    <div className="w-full max-w-[70rem] flex flex-col justify-center items-center gap-[1rem]">
                        <h1 className='text-white text-[4rem] font-[600] text-center z-[1]'>
                            Powerful for developers. <br /> Fast for everyone.
                        </h1>
                        <div className="w-full">
                            <h1 className='text-[#87878e] text-center'>
                                Bring blockchain to the people. UnionBank supports experiences <br /> for power users, new consumers, and everyone in between.
                            </h1>
                        </div>
                        <div className="w-full flex justify-center items-center gap-[1rem] z-[1]">
                            <Link to={`https://spiritual-wire-287.notion.site/UnionBank-API-Documentation-6a2928ba55e5442b91423fda3ebd8f78?pvs=4`}
                                className='text-white px-[1.7rem] py-[.7rem] border-white border-[1px] rounded-3xl hover:bg-white hover:text-black'
                                target='_blank'
                            >
                                READ DOCS
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
