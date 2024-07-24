
import DataGrids from '@/components/DataGrids'
import Header__UserStatement from '@/components/Header__UserStatement'
import { useEffect, useState } from 'react'
import axios from 'axios'
const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env

export default function UserStatement() {
    const [userTransactions, setUserTransactions] = useState([])
    const [accountno, setAccountno] = useState('')

    useEffect(() => {
        fetchCredentials()
    }, [])

    const fetchCredentials = async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            const res = await axios.get(`${VITE_HOST}/api/unionbank/myaccount/transactions`, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`,
                    accountno: token
                }
            })
            const account = res?.data?.accountno
            setAccountno(account)

            const transactions = res?.data?.data
            const formattedData = transactions.map((trans, index) => ({
                id: index + 1,
                date: trans?.createdAt,
                reference: trans?._id,
                debit: trans?.amount,
                credit: trans?.amount,
                servicefee: trans?.fee,
                description: trans?.description,
                transactionType: trans?.transactionType,
                balance: trans?.balance
            }))
            setUserTransactions(formattedData)
        } catch (error) {
            console.error(error)
        }
    }

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
            <div className="w-full h-screen bg-[#ffffff] flex flex-col justify-start">
                <Header__UserStatement accountno={accountno} />
                <div className="w-full h-[80%] flex flex-col justify-evenly px-[1rem]">
                    {/* <div className="flex justify-start items-center gap-[1rem]">
                        <input
                            type="text"
                            className="block w-[20rem] rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            placeholder='Search here...'
                        />
                    </div> */}
                    <div className="w-full h-[90%]">
                        <DataGrids columnsTest={UserColumns} rowsTest={userTransactions} descCol={`id`} colVisibility={{ id: false }} />
                    </div>
                </div>
            </div>
        </>
    )
}
