import { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import Header__Dashboard from '../../../components/Header__dashboard'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env

export default function OpenAccount() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        mobileno: '',
        accountType: '',
        amount: ''
    })
    const navigate = useNavigate()

    useEffect(() => {
        fetchCredentials()
    }, [])

    const fetchCredentials = () => {
        try {
            const credentials = sessionStorage.getItem('credentials')
            const customerdetails = sessionStorage.getItem('customerdetails')

            if (!credentials) return navigate('/unionbank')
            const { firstname, lastname, email, mobileno } = JSON.parse(customerdetails)
            const fullname = firstname + " " + lastname

            setValues((prev) => ({
                ...prev,
                name: fullname,
                email: email,
                mobileno: mobileno
            }))


        } catch (error) {
            console.error(error)
        }
    }

    const handleCreateAccount = async (e) => {
        try {
            e.preventDefault()
            const credentials = sessionStorage.getItem('credentials')
            const { userId: rbid } = JSON.parse(credentials)
            const { name, email, mobileno, accountType } = values

            if (!accountType || accountType === 'none') return alert('Please choose the account type!')

            const res = await axios.post(`${VITE_HOST}/api/createuser`, { name, email, mobileno, password: '123', rbid: rbid }, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                }
            })
            if (res?.data?.success) {
                const userId = res?.data?.data

                const createaccount = await axios.post(`${VITE_HOST}/api/createaccount`, { userId, accountType, rbid: rbid }, {
                    headers: {
                        Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                    }
                })
              
                if (createaccount?.data?.success) {
                    alert(createaccount?.data?.message)
                    navigate('/customers')
                }
            } else {
                alert(res?.data?.message)
            }

        } catch (error) {
            console.error(error)
        }
    }

    const handleBack = () => {
        navigate('/customers/addcustomer')
    }

    const handleOnChangeInitDepo = (e) => {
        const { value } = e.target
        setValues((prev) => ({
            ...prev,
            amount: value
        }))
        console.log(values)
    }


    const handleAccountTypeSelect = (type) => {
        setValues((prev) => ({
            ...prev,
            accountType: type
        }));
        console.log(values)
    };

    return (
        <>
            <div className="flex">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-center p-[1rem] overflow-auto ">
                    <Header__Dashboard breadcrumbs={breadCrumbs} />
                    <form
                        onSubmit={handleCreateAccount}
                        className='w-full h-[95%] flex flex-col justify-start items-center px-[5rem]'>
                        <div className="space-y-12 pt-[5rem] pb-[20rem]">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Account Type</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Select account type.</p>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-10">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                            Account type *
                                        </label>
                                        <div className="mt-2">
                                            <Menu as="div" className="relative inline-block text-left">
                                                <div>
                                                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                        {
                                                            values?.accountType ? values?.accountType : 'Options'
                                                        }
                                                        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    </MenuButton>
                                                </div>

                                                <MenuItems transition className="absolute cursor-pointer  right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                                                    <MenuItem onClick={() => handleAccountTypeSelect('None')} className='hover:bg-gray-100 py-[.7rem]'>
                                                        <h1 className={`text-gray-700 block px-4 py-2 text-sm text-center`} >
                                                            None
                                                        </h1>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleAccountTypeSelect('savings')} className='hover:bg-gray-100 py-[.7rem]'>
                                                        <h1 className={`text-gray-700 block px-4 py-2 text-sm text-center`} >
                                                            Savings
                                                        </h1>
                                                    </MenuItem>
                                                </MenuItems>
                                            </Menu>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <div className="sm:col-span-2">
                                            <label htmlFor="initialdeposit" className="block text-sm font-medium leading-6 text-gray-900">
                                                Initial Deposit (Optional)
                                            </label>
                                            <div className="mt-2">
                                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">PHP/</span>
                                                    <input
                                                        onChange={handleOnChangeInitDepo}
                                                        type="text"
                                                        name="initialdeposit"
                                                        id="initialdeposit"
                                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                        placeholder="100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-end gap-x-6">
                                <button
                                    onClick={handleBack}
                                    className="text-sm font-semibold leading-6 text-gray-900">
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-[#111111] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#333333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}

const breadCrumbs = [
    { title: 'Customers', href: '/customers', isLink: true },
    { title: 'Add Customer', href: '/customers/addcustomer', isLink: true },
    { title: 'Open Account', isLink: false },
]