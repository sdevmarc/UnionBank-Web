import { CreateAnnouncement } from '@/api/Admin'
import HeaderDashboard from '@/components/Header__dashboard'
import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MaintenanceWrapper() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [values, setValues] = useState({
        dateFrom: '',
        dateTo: '',
        content: ''
    })

    // const { data: credentials = '', isLoading: credentialsLoading } = useQuery({
    //     queryFn: () => fetchCredentials(),
    //     queryKey: ['maintenanceCredentials']
    // })

    const { mutateAsync: Announcement } = useMutation({
        mutationFn: CreateAnnouncement,
        onSuccess: (data) => {
            if (data?.success) {
                toast({ title: "Success!", description: `${data?.message}` })
                navigate('/maintenance')
                return
            }
            return toast({ title: "Uh, oh! Something went wrong.", description: `${data?.message}` })
        }
    })

    const handleCreateAnnouncement = (e) => {
        e.preventDefault()
        Announcement({ dateFrom: values?.dateFrom, dateTo: values?.dateTo, content: values?.content })
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // useEffect(() => {
    //     if (!credentialsLoading && !credentials) { navigate('/unionbank') }
    // }, [credentials, navigate])

    return (
        <>
            <div className="flex bg-white dark:bg-[#242526]">
                <Sidebar />
                {/* <AlertDialogs open={isDialog} onClose={handleDialogCancel} onConfirm={handleTransfer} content={` This action cannot be undone. This will permanently transfer funds to another account.`} /> */}
                {/* {(accountLoading || transferLoading) && <Loading />} */}
                <div className="w-[80%] h-screen flex flex-col justify-start items-center p-[1rem] overflow-auto ">
                    <HeaderDashboard breadcrumbs={breadCrumbs} />
                    <form onSubmit={handleCreateAnnouncement} className='w-full h-[95%] flex flex-col justify-start items-center px-[5rem]'>
                        <div className="space-y-12 pt-[5rem] pb-[20rem]">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Maintenance Information</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-[#8f8f96]">
                                    Please provide information in what you will announce.
                                </p>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="dateFrom" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                            Date from
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                                                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm dark:text-[#8f8f96]">from/</span>
                                                <input
                                                    value={values?.dateFrom}
                                                    onChange={handleOnChange}
                                                    required
                                                    type="date"
                                                    name="dateFrom"
                                                    id="dateFrom"
                                                    autoComplete="dateFrom"
                                                    className="block flex-1 border-0 bg-transparent px-[.7rem] py-1.5 pl-1 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="dateTo" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                            Date to
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                                                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm dark:text-[#8f8f96]">to/</span>
                                                <input
                                                    value={values?.dateTo}
                                                    onChange={handleOnChange}
                                                    required
                                                    type="date"
                                                    name="dateTo"
                                                    id="dateTo"
                                                    autoComplete="dateTo"
                                                    className="block flex-1 border-0 bg-transparent px-[.7rem] py-1.5 pl-1 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                            Content
                                        </label>
                                        <div className="mt-2">
                                            <textarea
                                                value={values?.content}
                                                onChange={handleOnChange}
                                                id="content"
                                                name="content"
                                                rows={3}
                                                className="block w-full rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-[#8f8f96]">Write a few sentences about your content.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-end gap-x-6">
                                <Button type='submit' variant='secondary' >
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
    { title: 'View Maintenance', href: '/maintenance', isLink: true },
    { title: 'Create Maintenance', isLink: false },
]
