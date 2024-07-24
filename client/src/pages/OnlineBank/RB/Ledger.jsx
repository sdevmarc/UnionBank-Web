import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../../../components/Sidebar'
import Header__Dashboard from '../../../components/Header__dashboard'
import DataGrids from '../../../components/DataGrids'
import axios from 'axios'
const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env

export default function Ledger() {
    const { accountid } = useParams()
    const [userTransactions, setUserTransactions] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchCredentials();
    }, []);

    useEffect(() => {
        fetchUserTransactions()
    }, []);

    const fetchCredentials = async () => {
        try {
            const credentials = sessionStorage.getItem('credentials')
            if (!credentials) return navigate('/unionbank')
        } catch (error) {
            console.error(error)
        }
    }

    const fetchUserTransactions = async () => {
        try {
            const res = await axios.get(`${VITE_HOST}/api/transactions/${accountid}`, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                }
            })

            const transactions = res?.data?.data
            const formattedData = transactions.map((trans, index) => ({
                id: index + 1,
                date: trans?.createdAt,
                reference: trans?._id,
                debit: trans?.amount,
                credit: trans?.amount,
                description: trans?.description,
                transactionType: trans?.transactionType,
                servicefee: trans?.fee,
                balance: trans?.balance
            }))
            setUserTransactions(formattedData)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSearchTransaction = async (e) => {
        try {
            const { value } = e.target
            if (value === '') return fetchUserTransactions()

            const res = await axios.get(`${VITE_HOST}/api/searchtransactions/${value}`, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                }
            })
            if (res?.data?.success) {
                const transactions = res?.data?.data
                const formattedData = transactions.map((trans, index) => ({
                    id: index + 1,
                    date: trans?.createdAt,
                    reference: trans?._id,
                    debit: trans?.amount,
                    credit: trans?.amount,
                    description: trans?.description,
                    transactionType: trans?.transactionType,
                    servicefee: trans?.fee,
                    balance: trans?.balance
                }))
                setUserTransactions(formattedData)
            } else {
                setUserTransactions([])
            }
        } catch (error) {
            console.error()
        }
    }

    const renderDebitCell = (params) => {
        return (
            <div className="w-full h-full flex justify-center items-center">
                {
                    (params.row.transactionType === 'withdrawal' || params.row.transactionType === 'transfer_debit') ? params.row.credit : '---'

                }
            </div>

        );
    };

    const renderCreditCell = (params) => {
        return (
            <div className="w-full h-full flex justify-center items-center">
                {
                    (params.row.transactionType === 'deposit' || params.row.transactionType === 'transfer_credit') ? params.row.debit : '---'
                }
            </div>

        );
    };

    const renderServiceFeeCell = (params) => {
        return (
            <div className="w-full h-full flex justify-center items-center">
                {
                    (params.row.transactionType === 'withdrawal' || params.row.transactionType === 'transfer_debit') ? params.row.servicefee : '---'
                }
            </div>

        );
    };

    const UserColumns = [
        {
            field: 'id',
            headerName: 'No.',
            width: 90,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 250,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'reference',
            headerName: 'Reference',
            type: 'number',
            width: 200,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'deposit',
            headerName: 'Deposit',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: renderCreditCell
        },
        {
            field: 'withdrawal',
            headerName: 'Withdrawal',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: renderDebitCell
        },
        {
            field: 'servicefee',
            headerName: 'Service fee',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: renderServiceFeeCell
        },
        {
            field: 'balance',
            headerName: 'Balance',
            width: 150,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 300,
            headerAlign: 'center',
            align: 'left'
        }
    ]

    return (
        <>
            <div className="flex">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-start p-[1rem] overflow-auto">
                    <Header__Dashboard breadcrumbs={breadCrumbs} title={`View Statement`} linkName={`View Accounts`} link={`/ledger`} />
                    <div className="w-full h-[95%] flex flex-col justify-start items-start gap-[1rem]">
                        <div className="w-full h-[5%]">
                            <h1 className='text-black font-[600] text-[1.2rem]'>
                                Transaction History
                            </h1>
                        </div>
                        <div className="w-full h-[5%] flex justify-start items-center gap-[1rem]">
                            <h1>
                                Search
                            </h1>
                            <input
                                onChange={handleSearchTransaction}
                                type="text"
                                className="block w-[20rem] rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                placeholder='Search here...'
                            />
                        </div>
                        <div className="w-full h-[80%]">
                            <DataGrids columnsTest={UserColumns} rowsTest={userTransactions} descCol={`id`} colVisibility={{ id: false }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const breadCrumbs = [
    { title: 'View Accounts', href: '/ledger', isLink: true },
    { title: 'View Statement', isLink: false },
]