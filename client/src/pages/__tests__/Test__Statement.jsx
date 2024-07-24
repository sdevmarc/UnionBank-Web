import Header from '@/components/__tests__/Header'
import LayerBG from '../../assets/BlurLayer.png'
import DataGrids from '@/components/DataGrids'
import { fetchUserTransactions } from '@/api/Transactions'
import { fetchCredentials } from '@/api/Credentials'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { GetAllAnnouncement } from '@/api/Admin'
import Maintenance from '@/components/__tests__/Maintenance'
import { Button } from '@/components/ui/button'

export default function Test__Statement() {
    const navigate = useNavigate()

    const { data: credentials = '', isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['newstatementCredentials']
    })

    const userId = credentials?.userId

    const { data: usertransactions = [], isLoading: usertransactionsLoading } = useQuery({
        queryFn: () => fetchUserTransactions({ userId }),
        queryKey: ['newUserTransactions', { userId }],
        enabled: !!userId
    })

    const { data: fetchAnnouncements = [], isLoading: announcementLoading } = useQuery({
        queryFn: () => GetAllAnnouncement(),
        queryKey: ['teststatementgetAnnouncements'],
        refetchInterval: 5000
    })

    const handleExport = () => {
        navigate(`/statement/print`)
    }

    useEffect(() => {
        if (!credentialsLoading && !credentials) { navigate('/unionbank') }
    }, [credentials, fetchAnnouncements, navigate])

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
            align: 'center',
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
            {
                fetchAnnouncements.length > 0 &&
                <Maintenance isButton dateFrom={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} dateTo={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} content={fetchAnnouncements[fetchAnnouncements.length - 1]?.content || ''} />
            }
            <div className="relative dark:bg-[#18191a] w-full flex flex-col justify-start items-center px-[2rem] py-[8rem] overflow-hidden">
                <Header />
                <img src={LayerBG} alt="Blur" className='absolute top-[-2rem] left-[30rem] sm:left-[25rem] md:left-[20rem] lg:-left-[15rem] w-[20rem] h-[10rem] scale-[5]' />
                <img src={LayerBG} alt="Blur" className='absolute top-[10rem] right-[-30rem] sm:right-[-25rem] md:right-[-20rem] lg:right-[-15rem] w-[20rem] h-[10rem] scale-[5]' />
                <div className="w-full h-screen max-w-[80rem]">
                    <div className="w-full h-full flex flex-col justify-start items-start gap-[1rem]">
                        <div className="relative w-full flex justify-between items-center">
                            <h1 className="z-[1] text-[1.2rem] text-black dark:text-white font-[600]">Statement of Account</h1>
                            <Button onClick={handleExport} variant='secondary'>
                                Print
                            </Button>
                        </div>

                        <div className="w-full h-full max-h-[45rem]">
                            <DataGrids columnsTest={UserColumns} rowsTest={usertransactions || []} descCol={`id`} colVisibility={{ id: false }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
