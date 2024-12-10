import { fetchAccount } from '@/api/Accounts'
import { fetchCredentials } from '@/api/Credentials'
import { fetchUserTransactions } from '@/api/Transactions'
import { fetchProfileDetails } from '@/api/User'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Print() {
    const navigate = useNavigate();
    const targetRef = useRef(null)

    const { data: credentials = '', isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['printcredentials']
    })

    const userId = credentials?.userId

    const { data: account} = useQuery({
        queryFn: () => fetchAccount({ userId }),
        queryKey: ['printaccount', { userId }],
        enabled: !!userId
    })

    const accountno = account?.accountno || ''

    const { data: profile = '' } = useQuery({
        queryFn: () => fetchProfileDetails({ userId }),
        queryKey: ['printprofile', { userId }],
        enabled: !!userId
    })

    const name = profile?.name

    const { data: transactions = [] } = useQuery({
        queryFn: () => fetchUserTransactions({ userId }),
        queryKey: ['printtransactions', { userId }],
        enabled: !!userId
    })

    const dateFrom = transactions[0]?.date
    const dateTo = transactions[transactions.length - 1]?.date

    const formatAmount = (amount) => {
        return 'PHP ' + amount;
    };

    useEffect(() => {
        if (!credentialsLoading && credentials) {
            if (targetRef.current === null) {
                window.print()
                targetRef.current = true
                navigate(-1)
            }
        }
    }, [credentials, navigate]);

    return (
        <>
            <div className="w-full h-screen flex flex-col justify-start items-center">
                <div className="w-full py-[3rem] max-w-[70rem] flex flex-col justify-center items-start gap-[1rem]">
                    <h1 className='text-[2rem] text-black font-[700]'>GENERAL LEDGER</h1>
                    <div className="w-full flex flex-col justify-start items-start">
                        <h1 className='text-[.85rem] font-[600]'>UnionBank</h1>
                        <h1 className='text-[.75rem] font-[400]'>For {`${dateFrom} - ${dateTo}`}</h1>
                    </div>
                </div>
                <div className="w-full max-w-[70rem] flex justify-between items-center">
                    <div className="w-full flex flex-col justify-center items-start gap-[1rem]">
                        <div className="w-full h-[5rem] flex flex-col justify-start items-start">
                            <h1 className='text-[.85rem] font-[500]'>Account Number: {accountno}</h1>
                            <h1 className='text-[.85rem] font-[500]'>Name: {name}</h1>
                        </div>
                    </div>
                </div>
                <div className="w-full pb-[5rem] max-w-[70rem] flex justify-between items-center">
                    <table className='w-full table-fixed'>
                        <thead className='border-[1px] bg-[#dedede] border-y-[1px] border-gray-400'>
                            <tr className='text-[.85rem] font-[600]'>
                                <td className='text-center py-[.85rem] border-x-[1px] border-b-[1px] border-gray-400'>Date</td>
                                <td className='text-center py-[.85rem] border-x-[1px] border-b-[1px] border-gray-400'>Description</td>
                                <td className='text-center py-[.85rem] border-x-[1px] border-b-[1px] border-gray-400'>Deposit</td>
                                <td className='text-center py-[.85rem] border-x-[1px] border-b-[1px] border-gray-400'>Withdrawal</td>
                                <td className='text-center py-[.85rem] border-x-[1px] border-b-[1px] border-gray-400'>Service Fee</td>
                                <td className='text-center py-[.85rem] border-x-[1px] border-b-[1px] border-gray-400'>Balance</td>
                            </tr>
                        </thead>
                        <tbody className='border-[1px]'>
                            {
                                [...transactions]
                                    .map((item) => (
                                        <tr key={item?.id}>
                                            <td className='text-center text-[.7rem] py-[.85rem] px-[.5rem] border-x-[1px] border-b-[1px] border-gray-400'>
                                                {item?.date}
                                            </td>
                                            <td className='text-center px-[1rem] text-[.7rem] py-[.85rem] border-x-[1px] border-b-[1px] border-gray-400'>
                                                {item?.description}
                                            </td>
                                            <td className='text-center text-[.85rem] py-[.85rem] border-x-[1px] border-b-[1px] border-gray-400'>
                                                {(item?.transactionType === 'deposit' || item?.transactionType === 'transfer_credit') ? formatAmount(item?.credit) : '---'}
                                            </td>
                                            <td className='text-center text-[.85rem] py-[.85rem] border-x-[1px] border-b-[1px] border-gray-400'>
                                                {(item?.transactionType === 'withdrawal' || item?.transactionType === 'transfer_debit') ? formatAmount(item?.debit) : '---'}
                                            </td>
                                            <td className='text-center text-[.85rem] py-[.85rem] border-x-[1px] border-b-[1px] border-gray-400'>
                                                {(item?.transactionType === 'withdrawal' || item?.transactionType === 'transfer_debit') ? formatAmount(item?.servicefee) : '---'}
                                            </td>
                                            <td className='text-center text-[.85rem] py-[.85rem] border-x-[1px] border-b-[1px] border-gray-400'>
                                                {formatAmount(item?.balance)}
                                            </td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}
