import { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Header__Dashboard from '../../components/Header__dashboard'
import SavingsIcon from '@mui/icons-material/Savings';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import { fetchCredentials } from '@/api/Credentials';
import { fetchAccount } from '@/api/Accounts';
import PieChartHR from '@/components/charts/PieChart';
import AreaChart_Interactive from '@/components/charts/AreaChart__Interactive';
import BarChart_Horizontal from '@/components/charts/BarChart__Horizontal';

export default function Dashboard() {
    const navigate = useNavigate()

    const { data: credentials, isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['credentialsDashboard']
    })

    const userId = credentials?.userId
    const role = credentials?.role

    const { data: carddetails, isLoading: cardLoading } = useQuery({
        queryFn: () => fetchAccount({ userId }),
        queryKey: ['dashboardAccount', { userId }],
        enabled: !!userId,
        refetchInterval: 5000
    })

    const maskAccountNumber = (accountNumber) => {
        if (accountNumber.length !== 9) return accountNumber;
        return '******' + accountNumber.slice(-3);
    };

    useEffect(() => {
        if (!credentialsLoading && !credentials) {
            navigate('/unionbank')
        }
    }, [credentials, navigate]);

    return (
        <>
            <div className="flex bg-white dark:bg-[#242526]">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-start p-[1rem] overflow-auto">
                    <Header__Dashboard breadcrumbs={breadCrumbs} />
                    <div className="w-full h-[5%] flex flex-col justify-start items-start">
                        <div className="w-full h-[5dvh] flex justify-start items-center">
                            <h1 className='text-black dark:text-white font-[600] text-[1.2rem]'>
                                {carddetails && ('Your Accounts')}
                                {role === 'rb' && ('Welcome')}
                                {role === 'hr' && ('Welcome')}
                                {role === 'admin' && ('Welcome')}
                            </h1>
                        </div>
                        {
                            carddetails && (
                                <div className="w-full flex justify-start items-start gap-[1rem] flex-wrap">
                                    <Link
                                        to={`/carddetails`}
                                        className="cursor-pointer hover:scale-[.98] duration-300 ease w-[18rem] sm:w-[20rem] md:w-[22rem] lg:w-[24rem] h-[10rem] sm:h-[11re] md:h-[12rem] lg:h-[13rem] rounded-md shadow-[_0_10px_15px_-3px_rgba(0,0,0,0.15)] flex flex-col justify-evenly bg-[#111111] items-start p-[1rem]">
                                        <h1 className='text-white font-[500] text-[.9rem]'>Savings Account</h1>
                                        <div className="w-full flex justify-start items-center gap-[1rem]">
                                            <SavingsIcon style={{ color: 'white', fontSize: '2rem' }} />
                                            <div className="flex flex-col justify-center items-start">
                                                <h1 className='text-white'>
                                                    REGULAR {carddetails?.accountType === 'savings' && 'SAVINGS'}
                                                </h1>
                                                <h1 className='text-white'>
                                                    {maskAccountNumber(carddetails?.accountno)}
                                                </h1>
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-between items-center">
                                            <h1 className='text-white'>Current Balance</h1>
                                            <h1 className='text-white'>
                                                PHP {carddetails?.balance}
                                            </h1>
                                        </div>
                                    </Link>
                                </div>
                            )
                        }
                        <div className="w-full flex flex-col justify-start items-start py-[1rem] gap-[1rem]">
                            <div className="w-full flex justify-start items-start gap-[1rem] flex-wrap">
                                <div className="w-full flex justify-start gap-[1rem]">
                                    {(role === 'hr' || role === 'admin') && <PieChartHR />}
                                    {(role === 'it' || role === 'admin') && <BarChart_Horizontal />}
                                </div>
                                <div className="w-full">
                                    {(role === 'rb' || role === 'admin') && <AreaChart_Interactive title={`Daily transactions analysis`} subtitle={`Showing transactions for the last 6 days`} />}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

const breadCrumbs = [
    // { title: 'Home', href: '/', isLink: true },
    { title: 'Dashboard', isLink: false },
]