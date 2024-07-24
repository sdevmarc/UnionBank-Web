import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Header__Dashboard from '../../components/Header__dashboard'
import Toggle from '../../components/Toggle'
import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchProfileDetails, UpdateProfileUser } from '@/api/User'
import { fetchCredentials } from '@/api/Credentials'
import { AlertDialogs } from '@/components/AlertDialog'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'

export default function UpdateAccount() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [isDialog, setDialog] = useState(false)
    const [values, setValues] = useState({
        name: '',
        email: '',
        mobileno: '',
        role: ''
    })

    const { data: credentials, isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['updateprofileCredentials']
    })

    const userId = credentials?.userId

    const { data: profileDetails, isLoading: profiledetailsLoading } = useQuery({
        queryFn: () => fetchProfileDetails({ userId }),
        queryKey: ['updateprofileDetails', { userId }],
        enabled: !!userId
    })

    const { mutateAsync: UpdateProfile, isPending: updateLoading } = useMutation({
        mutationFn: UpdateProfileUser,
        onSuccess: (data) => {
            if (data?.success) {
                toast({ title: "Success!", description: `${data?.message}, please login again!` })
                sessionStorage.clear()
                navigate('/profile')
                return
            }
            return toast({ title: "Uh oh! Something went wrong.", description: data?.message })
        }
    })

    const handleSubmit = (e) => {
        try {
            e.preventDefault()
            const { name, email, mobileno, role } = values
            if (!name || !email || !mobileno || !role) return toast({ title: "Uh, oh! Something went wrong.", description: 'Fields must not be empty.', });
            UpdateProfile({ userId, name, email, mobileno, role })
        } catch (error) {
            console.error(error)
        } finally {
            setDialog(false)
        }
    }

    const handleChangeDialog = (e) => {
        e.preventDefault()
        const { name, email, mobileno, role } = values
        if (name === '' || email === '' || mobileno === '' || role === '') return
        setDialog(true)
    }

    const handleDialogCancel = () => {
        setDialog(false)
    }

    const handleCancel = () => {
        navigate('/profile')
    }

    const handleToggleCheck = (e) => {
        if (e === true) {
            setValues((prev) => ({
                ...prev,
                role: 'developer'
            }))
        } else {
            setValues((prev) => ({
                ...prev,
                role: 'user'
            }))
        }

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
        if (!profiledetailsLoading && profileDetails) {
            setValues((prev) => ({
                ...prev,
                name: profileDetails?.name,
                email: profileDetails?.email,
                mobileno: profileDetails?.mobileno,
                role: profileDetails?.role,
            }))
        }
    }, [credentials, profileDetails, navigate])

    return (
        <>
            <div className="flex bg-white dark:bg-[#242526]">
                <Sidebar />
                <AlertDialogs open={isDialog} onClose={handleDialogCancel} onConfirm={handleSubmit} content={`This action cannot be undone. This will update your profile in UnionBank.`} />
                {(profiledetailsLoading || updateLoading) && <Loading />}
                <div className="w-[80%] h-screen flex flex-col justify-start items-center p-[1rem] overflow-auto ">
                    <Header__Dashboard breadcrumbs={breadCrumbs} />
                    <form
                        onSubmit={handleSubmit}
                        className='w-full h-[95%] flex flex-col justify-start items-center px-[5rem]'>
                        <div className="space-y-12 pt-[5rem] pb-[20rem]">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Personal Information</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-[#8f8f96]">Use a permanent address where you can receive mail.</p>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                                    <div className="sm:col-span-4">
                                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
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
                                </div>
                                <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3'>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
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
                                    <div className="sm:col-span-1">
                                        <label htmlFor="mobileno" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                            Mobile No.
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={handleOnChange}
                                                value={values?.mobileno}
                                                id="mobileno"
                                                name="mobileno"
                                                type="text"
                                                inputMode='numeric'
                                                className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3'>
                                    <div className="sm:col-span-1 flex flex-col gap-[.7rem]">
                                        <div className="sm:col-span-1">
                                            <label htmlFor="currentpassword" className="block text-sm font-medium leading-6 text-gray-900">
                                                Current Password
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="currentpassword"
                                                    name="currentpassword"
                                                    type="text"
                                                    className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label htmlFor="newpassword" className="block text-sm font-medium leading-6 text-gray-900">
                                                New Password
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="newpassword"
                                                    name="newpassword"
                                                    type="text"
                                                    className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <label htmlFor="confirmpassword" className="block text-sm font-medium leading-6 text-gray-900">
                                                Confirm Password
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="confirmpassword"
                                                    name="confirmpassword"
                                                    type="text"
                                                    className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {
                                    (values?.role === 'user' || values?.role === 'developer') && (
                                        <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3'>
                                            <div className="sm:col-span-1">
                                                <div className="sm:col-span-3 flex justify-between items-center">
                                                    <div className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                                        Developer
                                                    </div>
                                                    <Toggle
                                                        isCheck={values?.role === 'user' ? false : true}
                                                        returnCheck={handleToggleCheck}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                            </div>
                            <div className="w-full flex items-center justify-end gap-x-6">
                                <button
                                    onClick={handleCancel}
                                    className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                                    Cancel
                                </button>
                                <Button variant='secondary' onClick={handleChangeDialog}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        </>
    )
}

const breadCrumbs = [
    { title: 'Profile', href: '/profile', isLink: true },
    { title: 'Edit Profile', isLink: false },
]