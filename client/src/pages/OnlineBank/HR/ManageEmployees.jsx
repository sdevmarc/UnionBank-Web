import { useEffect, useState } from 'react'
import Header__Dashboard from '../../../components/Header__dashboard'
import Sidebar from '../../../components/Sidebar'
import { useNavigate, useParams } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import axios from 'axios'

const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env

export default function ManageEmployees() {
    const { userId } = useParams()
    const [values, setValues] = useState({
        name: '',
        email: '',
        mobileno: '',
        role: ''
    })
    const navigate = useNavigate()

    useEffect(() => {
        fetchCredentials()
        fetchEmployees()
    }, [])

    const fetchCredentials = () => {
        try {
            const credentials = sessionStorage.getItem('credentials')
            if (!credentials) return navigate('/unionbank')
        } catch (error) {
            console.error(error)
        }
    }

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${VITE_HOST}/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                }
            })

            if (res?.data?.success) {
                const name = res?.data?.data?.name
                const email = res?.data?.data?.email
                const mobileno = res?.data?.data?.mobileno
                const role = res?.data?.data?.role

                setValues((prev) => ({
                    ...prev,
                    name: name,
                    email: email,
                    mobileno: mobileno,
                    role: role
                }))
            }

        } catch (error) {
            console.error(error)
        }
    }

    const handleCreateEmployee = async (e) => {
        try {
            e.preventDefault()
            const res = await axios.post(`${VITE_HOST}/api/createuser`,
                {
                    name: values?.name,
                    email: values?.email,
                    password: '123',
                    mobileno: values?.mobileno,
                    role: values?.role
                }, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                }
            })

            if (res?.data?.success) return alert(res?.data?.message)
            alert(res?.data?.message)
        } catch (error) {
            console.error(error)
        } finally {
            handleCleanUp()
        }
    }

    const handleUpdateEmployee = async (e) => {
        try {
            e.preventDefault()
            const credentials = sessionStorage.getItem('credentials')
            const { userId:rbid } = JSON.parse(credentials)

            const res = await axios.post(`${VITE_HOST}/api/updateuser/${userId}`,
                {
                    name: values?.name,
                    email: values?.email,
                    mobileno: values?.mobileno,
                    role: values?.role,
                    rbid: rbid
                }, {
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

    const handleCancel = () => {
        navigate('/employees')
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUserRole = (e) => {
        setValues((prev) => ({
            ...prev,
            role: e
        }))
    }

    const handleCleanUp = () => {
        setValues((prev) => ({
            ...prev,
            name: '',
            email: '',
            mobileno: '',
            role: ''
        }))
    }

    return (
        <>
            <div className="flex">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-center p-[1rem] overflow-auto ">
                    <Header__Dashboard breadcrumbs={breadCrumbs} />
                    <form
                        onSubmit={userId ? handleUpdateEmployee : handleCreateEmployee}
                        className='w-full h-[95%] flex flex-col justify-start items-center px-[10rem]'>
                        <div className="space-y-12 pt-[5rem] pb-[20rem]">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                                    <div className="sm:col-span-6">
                                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                            Full Name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={handleOnChange}
                                                value={values?.name}
                                                required
                                                type="text"
                                                name="name"
                                                id="name"
                                                autoComplete="name"
                                                className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-5">
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Email address
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={handleOnChange}
                                                value={values?.email}
                                                required
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="mobileno" className="block text-sm font-medium leading-6 text-gray-900">
                                            Mobile No.
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={handleOnChange}
                                                value={values?.mobileno}
                                                required
                                                id="mobileno"
                                                name="mobileno"
                                                type="text"
                                                inputMode='numeric'
                                                className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <Menu as="div" className="relative inline-block text-left">
                                                <div>
                                                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                        {values?.role === '' && 'Options'}
                                                        {values?.role === 'none' && 'Options'}
                                                        {values?.role === 'hr' && 'HR'}
                                                        {values?.role === 'it' && 'IT'}
                                                        {values?.role === 'rb' && 'RB'}
                                                        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    </MenuButton>
                                                </div>

                                                <MenuItems transition className="absolute cursor-pointer  right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                                                    <MenuItem onClick={() => handleUserRole('none')} className='hover:bg-gray-100 py-[.7rem]'>
                                                        <h1 className={`text-gray-700 block px-4 py-2 text-sm text-center`} >
                                                            None
                                                        </h1>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleUserRole('hr')} className='hover:bg-gray-100 py-[.7rem]'>
                                                        <h1 className={`text-gray-700 block px-4 py-2 text-sm text-center`} >
                                                            Human Resource
                                                        </h1>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleUserRole('it')} className='hover:bg-gray-100 py-[.7rem]'>
                                                        <h1 className={`text-gray-700 block px-4 py-2 text-sm text-center`} >
                                                            IT Department
                                                        </h1>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleUserRole('rb')} className='hover:bg-gray-100 py-[.7rem]'>
                                                        <h1 className={`text-gray-700 block px-4 py-2 text-sm text-center`} >
                                                            Retail Banking
                                                        </h1>
                                                    </MenuItem>

                                                </MenuItems>
                                            </Menu>
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
                                    type='submit'
                                    className="rounded-md bg-[#111111] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#333333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        </>
    )
}

const breadCrumbs = [
    { title: 'Employees', href: '/employees', isLink: true },
    { title: 'Manage Employee', isLink: false },
]