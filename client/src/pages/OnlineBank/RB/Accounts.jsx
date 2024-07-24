import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../../components/Sidebar'
import Header__Dashboard from '../../../components/Header__dashboard'
import DataGrids from '../../../components/DataGrids'
import { useQuery } from '@tanstack/react-query'
import { fetchCredentials } from '@/api/Credentials'
import { fetchRBAccounts, SearchRbAccounts } from '@/api/Accounts'
import { Button } from '@/components/ui/button'
import '../css/Accounts.css'

export default function Accounts() {
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const { data: credentials, isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['accountsCredentials']
    })

    const { data: rbaccounts } = useQuery({
        queryFn: () => fetchRBAccounts(),
        queryKey: ['accountsRbAccounts']
    })

    const { data: searchrbaccounts } = useQuery({
        queryFn: () => SearchRbAccounts(search),
        queryKey: ['searchRbAccounts', search],
        enabled: !!search
    })

    const handleOnChangeSearch = (e) => {
        const { value } = e.target
        setSearch(value)
    }

    const handleViewAccount = (e) => {
        navigate(`/ledger/${e}`)
    }

    const handleDeposit = (e) => {
        navigate(`/ledger/deposit/${e}`)
    }

    const handleWithdraw = (e) => {
        navigate(`/ledger/withdrawal/${e}`)
    }

    useEffect(() => {
        if (!credentials && !credentialsLoading) { navigate('/unionbank') }
    }, [credentials, navigate]);

    const renderViewCell = (params) => {
        return (
            <div className="w-full h-full flex justify-evenly items-center">
                <div>
                    <Button variant='secondary' onClick={() => handleViewAccount(params?.row?.uid)} className="flex justify-center items-center hover:scale-[.98] duration-300 ease">
                        <h1>View Statement</h1>
                    </Button>
                </div>

                <div className='flex flex-col gap-[.5rem]'>
                    <Button variant='secondary' onClick={() => handleDeposit(params?.row?.uid)} className="flex justify-center items-center hover:scale-[.98] duration-300 ease">
                        <h1>Deposit</h1>
                    </Button>
                    <Button variant='secondary' onClick={() => handleWithdraw(params?.row?.uid)} className="flex justify-center items-center hover:scale-[.98] duration-300 ease">
                        <h1>Withdraw</h1>
                    </Button>
                </div>

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
            field: 'accountno',
            headerName: 'Account No.',
            width: 200,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: 'Full Name',
            type: 'number',
            width: 350,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 450,
            headerAlign: 'center',
            align: 'center',
            renderCell: renderViewCell
        }
    ]

    return (
        <>
            <div className="flex bg-white dark:bg-[#242526]">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-start p-[1rem] overflow-auto">
                    <Header__Dashboard breadcrumbs={breadCrumbs} />
                    <div className="w-full h-[95%] flex flex-col justify-start items-start gap-[1rem]">
                        <div className="w-full h-[5%]">
                            <h1 className='text-black dark:text-white font-[600] text-[1.2rem]'>
                                Account Holders
                            </h1>
                        </div>
                        <div className="w-full h-[5%] flex justify-start items-center gap-[1rem]">
                            <h1 className='text-black dark:text-white'>
                                Search
                            </h1>
                            <input
                                onChange={handleOnChangeSearch}
                                type="text"
                                className="block w-[20rem] rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                placeholder='Search here...'
                            />
                            {/* <Button>
                                <SearchIcon />
                            </Button> */}
                        </div>
                        <div className="w-full h-[80%]">
                            <DataGrids columnsTest={UserColumns} rowsTest={search === '' ? rbaccounts || [] : searchrbaccounts || []} descCol={`id`} colVisibility={{ id: false }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const breadCrumbs = [
    // { title: 'Home', href: '/', isLink: true },
    { title: 'View Accounts', isLink: false },
]