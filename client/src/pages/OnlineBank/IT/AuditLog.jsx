import { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import Header__Dashboard from '../../../components/Header__dashboard';
import DataGrids from '../../../components/DataGrids';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env

export default function AuditLog() {
    const [values, setValues] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchCredentials()
        fetchAuditLogs()
    }, [])

    const fetchCredentials = () => {
        try {
            const credentials = sessionStorage.getItem('credentials')
            if (!credentials) return navigate('/unionbank')
        } catch (error) {
            console.error(error)
        }
    }

    const fetchAuditLogs = async () => {
        try {
            const res = await axios.get(`${VITE_HOST}/api/it/auditlog`, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                }
            })

            const auditlogs = res?.data?.data
            const formattedData = auditlogs.map((acc, index) => ({
                id: index + 1,
                did: acc?._id,
                userId: acc?.userId,
                action: acc?.action,
                collectionName: acc?.collectionName,
                documentId: acc?.documentId,
                changes: JSON.stringify(acc?.changes),
                description: acc?.description,
                date: acc?.date,
                createdAt: acc?.createdAt
            }))
            setValues(formattedData)
        } catch (error) {
            console.error(error)
        }
    }

    const handleOnChangeSearch = async (e) => {
        try {
            const { value } = e.target

            if (value === '') return fetchAuditLogs()

            const res = await axios.get(`${VITE_HOST}/api/it/auditlog/${value}`, {
                headers: {
                    Authorization: `BEarer ${VITE_ADMIN_TOKEN}`
                }
            })
            const auditlogs = res?.data?.data
            const formattedData = auditlogs.map((acc, index) => ({
                id: index + 1,
                did: acc?._id,
                userId: acc?.userId,
                action: acc?.action,
                collectionName: acc?.collectionName,
                documentId: acc?.documentId,
                changes: JSON.stringify(acc?.changes),
                description: acc?.description,
                date: acc?.date,
                createdAt: acc?.createdAt
            }))
            setValues(formattedData)
        } catch (error) {
            console.error(error)
        }
    }

    const columns = [
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
            field: 'userId',
            headerName: 'User ID',
            width: 200,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'collectionName',
            headerName: 'Collection Name',
            width: 200,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'documentId',
            headerName: 'Document ID',
            width: 200,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'changes',
            headerName: 'Changes',
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
    ];

    return (
        <>
            <div className="flex bg-white dark:bg-[#242526]">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-start p-[1rem] overflow-hidden">
                    <Header__Dashboard breadcrumbs={breadCrumbs} />
                    <div className="w-full h-[95%] flex flex-col justify-start gap-[1rem]">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex justify-start items-center gap-[1rem]">
                                <h1 className='text-black dark:text-white'>
                                    Search
                                </h1>
                                <input
                                    onChange={handleOnChangeSearch}
                                    type="text"
                                    className="block w-[20rem] rounded-md border-0 px-[.7rem] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    placeholder='Search here...'
                                />
                            </div>
                        </div>
                        <DataGrids columnsTest={columns} rowsTest={values} descCol={`date`} colVisibility={{ id: false }} />
                    </div>
                </div>
            </div >
        </>
    )
}

const breadCrumbs = [
    // { title: 'Home', href: '/', isLink: true },
    { title: 'Audit Log', isLink: false },
]