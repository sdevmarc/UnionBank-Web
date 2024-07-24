import { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Header__Dashboard from '../../components/Header__dashboard'
import DataGrids from '../../components/DataGrids'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchUserTransactions } from '@/api/Transactions'
import { fetchCredentials } from '@/api/Credentials'

export default function Transactions() {
    const navigate = useNavigate()

    const { data: credentials, isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['statementCredentials']
    })

    const userId = credentials?.userId

    const { data: usertransactions, isLoading: usertransactionsLoading } = useQuery({
        queryFn: () => fetchUserTransactions({ userId }),
        queryKey: ['UserTransactions', { userId }],
        enabled: !!userId
    })

    useEffect(() => {
        if (!credentialsLoading && !credentials) { navigate('/unionbank') }
    }, [credentials, navigate])

    const renderDebitCell = (params) => {
        return (
            <div className="w-full h-full flex justify-center items-center">
                {
                    (params.row.transactionType === 'deposit' || params.row.transactionType === 'transfer_credit') ? params.row.debit : '---'
                }
            </div>

        );
    };

    const renderCreditCell = (params) => {
        return (
            <div className="w-full h-full flex justify-center items-center">
                {
                    (params.row.transactionType === 'withdrawal' || params.row.transactionType === 'transfer_debit') ? params.row.credit : '---'
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
            width: 200,
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
            field: 'debit',
            headerName: 'Debit (PHP)',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: renderDebitCell
        },
        {
            field: 'credit',
            headerName: 'Credit (PHP)',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: renderCreditCell
        },
        {
            field: 'servicefee',
            headerName: 'Service fee',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: renderServiceFeeCell
        },
        {
            field: 'balance',
            headerName: 'Balance',
            width: 200,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 300,
            headerAlign: 'center',
            align: 'center'
        }
    ]

    return (
        <>
            <div className="flex">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-start p-[1rem] overflow-auto">
                    <Header__Dashboard breadcrumbs={breadCrumbs} />
                    <div className="w-full h-[95%] flex flex-col justify-start items-start gap-[1rem]">
                        <div className="w-full h-[5%]">
                            <h1 className='text-black font-[600] text-[1.2rem]'>
                                Transaction History
                            </h1>
                        </div>
                        <div className="w-full h-[90%]">
                            <DataGrids columnsTest={UserColumns} rowsTest={usertransactions || []} descCol={`id`} colVisibility={{ id: false }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const breadCrumbs = [
    // { title: 'Home', href: '/', isLink: true },
    { title: 'View Statement', isLink: false },
]
