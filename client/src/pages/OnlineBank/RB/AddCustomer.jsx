import { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import Header__Dashboard from '../../../components/Header__dashboard'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCredentials } from '@/api/Credentials'

export default function AddCustomer() {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        firstname: '',
        lastname: '',
        email: '',
        mobileno: ''
    })

    const { data: credentials, isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['credentialsAddCustomer']
    })

    const handleNext = () => {
        sessionStorage.setItem('customerdetails', JSON.stringify(values))
        navigate('/customers/addcustomer/openaccount')
    }

    const handleCancel = () => {
        navigate('/customers')
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        if (!credentialsLoading && !credentials) { navigate('/unionbank') }
    }, [credentials, navigate])

    return (
        <>
            <div className="flex">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-center p-[1rem] overflow-auto ">
                    <Header__Dashboard breadcrumbs={breadCrumbs} />
                    <div className='w-full h-[95%] flex flex-col justify-start items-center px-[5rem]'>
                        <div className="space-y-12 pt-[5rem] pb-[20rem]  ">
                            <div className="border-b border-gray-900/10 pb-12 ">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">
                                            First name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={handleOnChange}
                                                type="text"
                                                name="firstname"
                                                id="firstname"
                                                autoComplete="given-name"
                                                className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900">
                                            Last name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={handleOnChange}
                                                type="text"
                                                name="lastname"
                                                id="lastname"
                                                autoComplete="family-name"
                                                className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-4">
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Email address
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                required
                                                onChange={handleOnChange}
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Mobile No.
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                required
                                                onChange={handleOnChange}
                                                id="mobileno"
                                                name="mobileno"
                                                type="text"
                                                inputMode='numeric'
                                                className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-end gap-x-6">
                                <button
                                    onClick={handleCancel}
                                    className="text-sm font-semibold leading-6 text-gray-900">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="rounded-md bg-[#111111] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#333333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}

const breadCrumbs = [
    { title: 'Customers', href: '/customers', isLink: true },
    { title: 'Add Customer', isLink: false },
]