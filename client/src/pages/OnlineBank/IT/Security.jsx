import { useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import Header from '../../../components/Header__dashboard'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env

export default function Security() {
    const navigate = useNavigate()

    useEffect(() => {
        fetchCredentials()
    }, [])

    const fetchCredentials = () => {
        try {
            const credentials = sessionStorage.getItem('credentials')
            if (!credentials) return navigate('/unionbank')
        } catch (error) {
            console.error(error)
        }
    }

    const handleBackup = async () => {
        try {
            const res = await axios.get(`${VITE_HOST}/api/it/backup`, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                }
            })
            if (res?.data?.success) return alert(res?.data?.message)
            alert(res?.data?.message)
        } catch (error) {
            console.error(error)
        }
    }

    const handleRestore = async () => {
        try {
            const res = await axios.get(`${VITE_HOST}/api/it/restore`, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                }
            })
            if (res?.data?.success) return alert(res?.data?.message)
            alert(res?.data?.message)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className="flex bg-white dark:bg-[#242526]">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-center p-[1rem] overflow-auto">
                    <Header breadcrumbs={breadCrumbs} />
                    <div className="w-full h-[95%] px-[20rem] py-[5rem]">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Security Information</h3>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Security details.</p>
                        </div>
                        <div className="mt-6 border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">Backup</dt>
                                    <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <div role="list" className="divide-y divide-gray-100 rounded-md">
                                            <div className="flex items-center justify-between pl-4 pr-5 text-sm leading-6">
                                                <div className="flex w-0 flex-1 items-center">
                                                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    <div className="ml-4 flex min-w-0 flex-1 gap-2 dark:text-white">
                                                        <span className="truncate font-medium">unionbankbackup.json</span>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex-shrink-0 ">
                                                    <button
                                                        onClick={handleBackup}
                                                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-white">
                                                        Backup
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">Restore</dt>
                                    <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">
                                        <div role="list" className="divide-y divide-gray-100 rounded-md">
                                            <div className="flex items-center justify-between pl-4 pr-5 text-sm leading-6">
                                                <div className="flex w-0 flex-1 items-center">
                                                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                        <span className="truncate font-medium">unionbankbackup.json</span>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <button
                                                        onClick={handleRestore}
                                                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-white">
                                                        Restore
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const breadCrumbs = [
    // { title: 'Home', href: '/', isLink: true },
    { title: 'Security', isLink: false },
]