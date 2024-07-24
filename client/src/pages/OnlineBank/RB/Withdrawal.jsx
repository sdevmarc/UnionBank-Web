import { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import Header__Dashboard from '../../../components/Header__dashboard'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios'
const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env

export default function Withdrawal() {
    const { toast } = useToast()
    const { accountid } = useParams()
    const [values, setValues] = useState({
        account: '',
        amount: '',
    })
    const navigate = useNavigate()

    useEffect(() => {
        fetchCredentials()
        fetchAccountNo()
    }, [])

    const fetchCredentials = () => {
        try {
            const credentials = sessionStorage.getItem('credentials')
            if (!credentials) return navigate('/unionbank')
        } catch (error) {
            console.error(error)
        }
    }


    const handleWithdrawal = async (e) => {
        try {
            e.preventDefault()
            const credentials = sessionStorage.getItem('credentials')
            const { userId } = JSON.parse(credentials)
            const { account, amount } = values
            const res = await axios.post(`${VITE_HOST}/api/withdrawtransaction`, { account, amount }, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`,
                    userId: userId
                }
            })
            if (res?.data?.success) {
                alert(res?.data?.message)
                return navigate('/ledger')
            }
            alert(res?.data?.message)
        } catch (error) {
            console.error(error)
        } finally {
            handleCleanUp()
        }
    }

    const fetchAccountNo = async () => {
        try {
            const res = await axios.get(`${VITE_HOST}/api/useraccount/${accountid}`, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                }
            })
            const accountno = res?.data?.data?.accountno
            setValues((prev) => ({
                ...prev,
                account: accountno
            }))
        } catch (error) {
            console.error(error)
        }
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCleanUp = () => {
        setValues((prev) => ({
            ...prev,
            amount: ''
        }))
    }

    const handleBack = () => {
        navigate('/ledger')
    }

    return (
        <>
            <div className="flex">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-center p-[1rem] overflow-auto ">
                    <Header__Dashboard breadcrumbs={breadCrumbs} />
                    <form
                        onSubmit={handleWithdrawal}
                        className='w-full h-[95%] flex flex-col justify-start items-center px-[5rem]'>
                        <div className="space-y-12 pt-[5rem] pb-[20rem]">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Withdrawal Details</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Please provide information for withdrawal.
                                </p>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="creditaccount" className="block text-sm font-medium leading-6 text-gray-900">
                                            Account No.
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                                                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">from/</span>
                                                <input
                                                    value={values?.account}
                                                    onChange={handleOnChange}
                                                    type="text"
                                                    name="account"
                                                    id="account"
                                                    autoComplete="account"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="withdrawal" className="block text-sm font-medium leading-6 text-gray-900">
                                            Amount
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                                                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">PHP/</span>
                                                <input
                                                    required
                                                    value={values?.amount}
                                                    onChange={handleOnChange}
                                                    type="text"
                                                    name="amount"
                                                    id="amount"
                                                    autoComplete="amount"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                />
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
                                    Withdraw
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
    { title: 'View Accounts', href: '/', isLink: true },
    { title: 'Withdrawal', isLink: false },
]