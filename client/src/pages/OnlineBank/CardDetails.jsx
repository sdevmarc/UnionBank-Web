import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Header__Dashboard from '../../components/Header__dashboard'
import { useQuery } from '@tanstack/react-query'
import { fetchAccount } from '@/api/Accounts'
import { fetchCredentials } from '@/api/Credentials'

export default function AccountStatement() {
    const navigate = useNavigate()

    const { data: credentials, isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['carddetailsCredentials']
    })
    const userId = credentials?.userId

    const { data: accounts, isLoading: accountsLoading, isFetched: accountsFetched } = useQuery({
        queryFn: () => fetchAccount({ userId }),
        queryKey: ['carddetailsAccounts', { userId }],
        enabled: !!userId
    })

    useEffect(() => {
        if (!credentials && !credentialsLoading) { navigate('/unionbank') }
    }, [credentials, navigate])

    const handleGoBack = () => {
        navigate('/')
    }
    return (
        <>
            <div className="flex">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-center p-[1rem] overflow-auto">
                    <Header__Dashboard breadcrumbs={breadCrumbs} />
                    <div className="w-full h-[95%] px-[20rem] py-[5rem]">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-base font-semibold leading-7 text-gray-900">Card Details</h3>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">An information of your card.</p>
                        </div>
                        <div className="border-t border-gray-100 mt-[1.5rem] pb-[20rem]">
                            <dl className="divide-y divide-gray-100 ">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Account Type</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {accounts?.accountType === 'savings' && 'Regular Savings'}
                                    </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Account Number</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {accounts?.accountno}
                                    </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Current Balance</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        PHP {accounts?.balance}
                                    </dd>
                                </div>
                                <div className="w-full flex items-center justify-end gap-x-6 pt-[2rem]">
                                    <button
                                        onClick={handleGoBack}
                                        className="rounded-md bg-[#111111] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#333333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Go back
                                    </button>
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
    { title: 'Dashboard', href: '/', isLink: true },
    { title: 'Card Details', isLink: false },
]