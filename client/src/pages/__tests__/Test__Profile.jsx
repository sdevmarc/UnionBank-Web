import Header from '@/components/__tests__/Header'
import LayerBG from '../../assets/BlurLayer.png'
import { Button } from '@/components/ui/button'
import { fetchProfileDetails } from '@/api/User'
import { fetchCredentials } from '@/api/Credentials'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import Profile from '../OnlineBank/Profile'
import { GetAllAnnouncement } from '@/api/Admin'
import Maintenance from '@/components/__tests__/Maintenance'

export default function Test__Profile() {
    const navigate = useNavigate()

    const { data: credentials = '', isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['profileCredentials']
    })

    const userId = credentials?.userId
    const role = credentials?.role

    const { data: profileDetails = '', isLoading: profileLoading } = useQuery({
        queryFn: () => fetchProfileDetails({ userId }),
        queryKey: ['newprofileDetails', { userId }],
        enabled: !!userId
    })

    const { data: fetchAnnouncements = [], isLoading: announcementLoading } = useQuery({
        queryFn: () => GetAllAnnouncement(),
        queryKey: ['testprofilegetAnnouncements'],
        refetchInterval: 5000
    })

    useEffect(() => {
        if (!credentialsLoading && !credentials) { navigate('/unionbank') }
    }, [credentials, fetchAnnouncements, navigate])

    const handleEdit = () => {
        navigate('/profile/updateprofile')
    }

    return (
        <>
            {
                fetchAnnouncements.length > 0 &&
                <Maintenance isButton dateFrom={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} dateTo={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} content={fetchAnnouncements[fetchAnnouncements.length - 1]?.content || ''} />
            }
            {
                (role === 'admin' || role === 'it' || role === 'rb' || role === 'hr') ? <Profile /> :
                    <div className="dark:bg-[#18191a] w-full flex flex-col justify-start items-center relative overflow-x-hidden pt-[8rem]">
                        <Header />
                        <img src={LayerBG} alt="Blur" className='absolute top-[-2rem] left-[30rem] sm:left-[25rem] md:left-[20rem] lg:-left-[15rem] w-[20rem] h-[10rem] scale-[5]' />
                        <img src={LayerBG} alt="Blur" className='absolute top-[10rem] right-[-30rem] sm:right-[-25rem] md:right-[-20rem] lg:right-[-15rem] w-[20rem] h-[10rem] scale-[5]' />
                        <div className="w-full h-screen max-w-[80rem] flex flex-col gap-[2rem] px-[10rem]">

                            <div>
                                <div className="px-4 sm:px-0">
                                    <h3 className="z-[1] text-base font-semibold leading-7 text-gray-900 dark:text-white">Account Information</h3>
                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-[#8f8f96]">Personal details and information.</p>
                                </div>
                                <div className="mt-6 border-t border-gray-100">
                                    <dl className="divide-y divide-gray-100">
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="z-[1] text-sm font-medium leading-6 text-gray-900 dark:text-white">Full name</dt>
                                            <dd className="z-[1] mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-white">
                                                {profileDetails?.name}
                                            </dd>
                                        </div>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="z-[1] text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                                Email address
                                            </dt>
                                            <dd className="z-[1] mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-white">
                                                {profileDetails?.email}
                                            </dd>
                                        </div>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="z-[1] text-sm font-medium leading-6 text-gray-900 dark:text-white">Account Status</dt>
                                            <dd className="z-[1] mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-white">
                                                {profileDetails?.isactive === false ? 'Inactive' : 'Active'}
                                            </dd>
                                        </div>
                                        {
                                            (profileDetails?.role === 'user' || profileDetails?.role === 'developer') && (
                                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt className="z-[1] text-sm font-medium leading-6 text-gray-900 dark:text-white">Developer</dt>
                                                    <dd className="z-[1] mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-white">
                                                        {profileDetails?.role === 'user' && 'Inactive'}
                                                        {profileDetails?.role === 'developer' && 'Active'}
                                                    </dd>
                                                </div>
                                            )
                                        }
                                        <div className="z-[1] w-full flex justify-end items-centerpx-4 py-6">
                                            <Button className='z-[1]' variant='secondary' onClick={handleEdit}>
                                                Edit Profile
                                            </Button>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
