import { fetchAccount } from "@/api/Accounts";
import { fetchCredentials } from "@/api/Credentials";
import { fetchUserTransactions } from "@/api/Transactions";
import Header from "@/components/__tests__/Header";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import SavingsIcon from '@mui/icons-material/Savings';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import LayerBG from '../../assets/BlurLayer.png'
import { useEffect } from "react";
import Dashboard from "../OnlineBank/Dashboard";
import { GetAllAnnouncement } from "@/api/Admin";
import Maintenance from "@/components/__tests__/Maintenance"
import ScreenLoading from "@/components/ScreenLoading";

export default function Test__Dashboard() {
    const navigate = useNavigate()

    const { data: credentials = '', isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['credentialsTestDashboard']
    })

    const userId = credentials?.userId
    const role = credentials?.role

    const { data: carddetails = '', isLoading: cardLoading } = useQuery({
        queryFn: () => fetchAccount({ userId }),
        queryKey: ['newdashboardAccount', { userId }],
        enabled: !!userId,
        refetchInterval: 5000
    })

    const { data: usertransactions = [], isLoading: usertransactionsLoading } = useQuery({
        queryFn: () => fetchUserTransactions({ userId }),
        queryKey: ['newdashboardUserTransactions', { userId }],
        enabled: !!userId,
        refetchInterval: 5000
    })

    const { data: fetchAnnouncements = [], isLoading: announcementLoading } = useQuery({
        queryFn: () => GetAllAnnouncement(),
        queryKey: ['testdashboardgetAnnouncements'],
        refetchInterval: 5000
    })

    const maskAccountNumber = (accountNumber) => {
        if (accountNumber.length !== 9) return accountNumber;
        return '******' + accountNumber.slice(-3);
    };

    const formatAmount = (amount) => {
        return 'PHP ' + amount;
    };

    const handleViewAll = () => {
        navigate('/statement')
    }

    useEffect(() => {
        if (!credentialsLoading && !credentials) {
            navigate('/unionbank')
        }
    }, [credentials, fetchAnnouncements, navigate])

    return (
        <>
            {
                (role === 'admin' || role === 'it') ? null :
                    fetchAnnouncements.length > 0 &&
                    <Maintenance isButton dateFrom={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} dateTo={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} content={fetchAnnouncements[fetchAnnouncements.length - 1]?.content || ''} />
            }
            {
                (role === 'admin' || role === 'it' || role === 'rb' || role === 'hr') ? <Dashboard /> :
                    <div className="relative dark:bg-[#18191a] w-full flex flex-col justify-center items-center px-[2rem] py-[8rem] overflow-hidden">
                        <Header />
                        <img src={LayerBG} alt="Blur" className=' z-[0] absolute top-[-2rem] left-[30rem] sm:left-[25rem] md:left-[20rem] lg:-left-[15rem] w-[20rem] h-[10rem] scale-[5]' />
                        <img src={LayerBG} alt="Blur" className='z-[0] absolute top-[10rem] right-[-30rem] sm:right-[-25rem] md:right-[-20rem] lg:right-[-15rem] w-[20rem] h-[10rem] scale-[5]' />
                        <div className="w-full h-screen max-w-[80rem]">
                            <div className="w-full flex flex-col justify-start items-start gap-[1rem]">
                                <h1 className="z-[1] text-[1.2rem] text-black dark:text-white font-[600]">Your accounts</h1>
                                <div className="w-full flex justify-start items-start gap-[1rem] flex-wrap">
                                    {
                                        cardLoading ? <Loading /> :
                                            <div className="z-[1] w-[23rem] h-[12rem] bg-[#e0dede] dark:bg-[#242526] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] rounded-xl border-[1px] border-gray-900/10 flex flex-col justify-evenly items-start p-[1rem]">
                                                <h1 className="text-[1.1rem] text-black dark:text-white font-[600]">SAVINGS ACCOUNT</h1>
                                                <div className="w-full flex justify-start items-center gap-[2rem]">
                                                    <SavingsIcon className="text-black dark:text-white font-[600]" style={{ fontSize: '2rem' }} />
                                                    <div className="flex flex-col">
                                                        <h1 className="text-[.9rem] text-black dark:text-white font-[500]">REGULAR SAVINGS</h1>
                                                        <h1 className="text-[.9rem] text-black dark:text-white font-[500]">{maskAccountNumber(carddetails?.accountno || '')}</h1>
                                                    </div>
                                                </div>
                                                <div className="w-full flex justify-between items-center">
                                                    <h1 className="text-[.9rem] text-black dark:text-white font-[500]">Current Balance</h1>
                                                    <h1 className="text-[.9rem] text-black dark:text-white font-[500]">PHP {carddetails?.balance || ''}</h1>
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>

                            <div className="relative w-full pt-[2rem] flex flex-col justify-start items-start gap-[1rem]">
                                <div className="w-full flex justify-between items-start">
                                    <div className="z-[1] w-[58%] h-[52vh] p-[2rem] flex flex-col justify-start items-start gap-[2.5rem] rounded-xl bg-white dark:bg-[#242526] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] border-[1px] border-gray-900/10">
                                        <div className="w-full flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <h1 className="text-[1.1rem] text-black dark:text-white font-[600]">Transactions</h1>
                                                <h1 className="text-[.8rem] text-[#8f8f96]">Recent transactions from UnionBank.</h1>
                                            </div>
                                            <Button onClick={handleViewAll} variant='secondary' size='md'>
                                                View All
                                            </Button>
                                        </div>
                                        <div className="w-full h-full flex flex-col overflow-auto">
                                            <div className="w-full flex justify-between items-center px-[1rem]">
                                                <h1 className="text-[.85rem] font-[500] text-[#8f8f96] dark:text-[rgb(219,219,219)]">Type</h1>
                                                <h1 className="text-[.85rem] font-[500] text-[#8f8f96] dark:text-[rgb(219,219,219)]">Amount</h1>
                                            </div>
                                            <Separator className="my-4" />
                                            {
                                                usertransactionsLoading ? <ScreenLoading /> :
                                                    usertransactions
                                                        .filter(item => item.transactionType === 'deposit' || item.transactionType === 'withdrawal')
                                                        .reverse()
                                                        .slice(0, 10)
                                                        .map((item) => (
                                                            <div key={item?.id} className="w-full">
                                                                <div className="w-full flex justify-between items-center px-[1rem]">
                                                                    <h1 className="text-[.85rem] font-[500] text-[#000000] dark:text-white">
                                                                        {item?.transactionType === 'deposit' && 'Deposit'}
                                                                        {item?.transactionType === 'withdrawal' && 'Withdrawal'}
                                                                    </h1>
                                                                    <h1 className="text-[.85rem] font-[500] text-[#000000] dark:text-white">
                                                                        {item?.transactionType === 'deposit' && formatAmount(item?.credit)}
                                                                        {item?.transactionType === 'withdrawal' && formatAmount(item?.debit)}
                                                                    </h1>
                                                                </div>
                                                                <Separator className="my-4" />
                                                            </div>
                                                        ))
                                            }
                                        </div>
                                    </div>
                                    <div className="z-[1] w-[40%] h-[52vh] p-[2rem] flex flex-col justify-start items-start gap-[2.5rem] rounded-xl bg-white dark:bg-[#242526] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] border-[1px] border-gray-900/10">
                                        <div className="w-full flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <h1 className="text-[1.1rem] font-[600] dark:text-white">External Payments</h1>
                                                <h1 className="text-[.8rem] text-[#8f8f96]">Recent transactions from outside.</h1>
                                            </div>
                                            <Button onClick={handleViewAll} variant='secondary' size='md'>
                                                View All
                                            </Button>
                                        </div>
                                        <div className="w-full h-full flex flex-col overflow-auto">
                                            <div className="w-full flex justify-between items-center px-[1rem]">
                                                <h1 className="text-[.85rem] font-[500] text-[#8f8f96] dark:text-[rgb(219,219,219)]">Reference</h1>
                                                <h1 className="text-[.85rem] font-[500] text-[#8f8f96] dark:text-[rgb(219,219,219)]">Amount</h1>
                                            </div>
                                            <Separator className="my-4" />
                                            {
                                                usertransactionsLoading ? null :
                                                    usertransactions
                                                        .filter(item => item.transactionType === 'transfer_debit' || item.transactionType === 'transfer_credit')
                                                        .reverse()
                                                        .slice(0, 10)
                                                        .map((item) => (
                                                            <div key={item?.id} className="w-full">
                                                                <div className="w-full flex justify-between items-center px-[1rem]">
                                                                    <div className=" flex flex-col justify-center items-start">
                                                                        <h1 className="text-[.85rem] font-[500] text-[#000000] dark:text-white">
                                                                            {item?.transactionType === 'transfer_debit' && 'Transferred'}
                                                                            {item?.transactionType === 'transfer_credit' && 'Received'}
                                                                        </h1>
                                                                        <h1 className="text-[.85rem] font-[500] text-[#8f8f96]">
                                                                            {item?.reference}
                                                                        </h1>
                                                                    </div>
                                                                    <h1 className="text-[.85rem] font-[500] text-[#000000] dark:text-white">
                                                                        {item?.transactionType === 'transfer_debit' && formatAmount(item?.credit)}
                                                                        {item?.transactionType === 'transfer_credit' && formatAmount(item?.debit)}
                                                                    </h1>
                                                                </div>
                                                                <Separator className="my-4" />
                                                            </div>
                                                        ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }

        </>
    )
}
