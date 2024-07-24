import { useEffect, useState } from 'react'
import Header__Dashboard from '../../../components/Header__dashboard'
import Sidebar from '../../../components/Sidebar'
import DataGrids from '../../../components/DataGrids';
import { Link, useNavigate } from 'react-router-dom';
import Toggle from '../../../components/Toggle';
import axios from 'axios'
import { Button } from '@/components/ui/button';

const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env

export default function Employees() {
    const [values, setValues] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchCredentials()
        fetchEmployedUsers()
    }, [])

    const fetchCredentials = () => {
        try {
            const credentials = sessionStorage.getItem('credentials')
            if (!credentials) return navigate('/unionbank')
        } catch (error) {
            console.error(error)
        }
    }

    const fetchEmployedUsers = async () => {
        try {
            const res = await axios.get(`${VITE_HOST}/api/employedusers`, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                }
            })
            const employees = res?.data?.data
            const formattedData = employees.map((acc, index) => ({
                id: index + 1,
                uid: acc?._id,
                name: acc?.name,
                email: acc?.email,
                isactive: acc?.isactive
            }))
            setValues(formattedData)
        } catch (error) {
            console.error(error)
        }
    }

    const handleOnChangeSearch = async (e) => {
        try {
            const { value } = e.target
            if (value === '') return fetchEmployedUsers()

            const res = await axios.get(`${VITE_HOST}/api/searchremployedusers/${value}`, {
                headers: {
                    Authorization: `BEarer ${VITE_ADMIN_TOKEN}`
                }
            })
            const employees = res?.data?.data
            const formattedData = employees.map((acc, index) => ({
                id: index + 1,
                uid: acc?._id,
                name: acc?.name,
                email: acc?.email,
                isactive: acc?.isactive
            }))
            setValues(formattedData)
        } catch (error) {
            console.error(error)
        }
    }

    const handleOnClickEdit = (e) => {
        navigate(`/employees/${e}`)
    }

    const renderIsActiveToggle = (params) => {
        const [isActive, setIsActive] = useState(params.row.isactive);

        const handleUpdateActiveEmployee = async (e) => {
            setIsActive(e);
            try {
                const credentials = sessionStorage.getItem('credentials')
                const { userId } = JSON.parse(credentials)
                await axios.post(`${VITE_HOST}/api/updateactiveuser/${params.row.uid}`,
                    {
                        isactive: e,
                        rbid: userId
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${VITE_ADMIN_TOKEN}`,
                        }
                    });
            } catch (error) {
                console.error('Error updating active status:', error);
            }
        };
        return (
            <div className="w-full h-full flex justify-center items-start">
                <Toggle
                    isCheck={isActive}
                    returnCheck={handleUpdateActiveEmployee}
                />
            </div>

        )
    }

    const renderActionButtons = (params) => {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <Button variant="secondary" onClick={() => handleOnClickEdit(params.row.uid)}>
                    <h1>Edit</h1>
                </Button>
            </div>
        );
    };

    const columns = [
        {
            field: 'id',
            headerName: 'No.',
            width: 90,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: 'Full Name',
            width: 250,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'isactive',
            headerName: 'Active',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: renderIsActiveToggle
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: renderActionButtons
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
                            <div className="w-full flex items-center justify-end gap-x-6">
                                <Link
                                    to={`/employees/manageemployee`}
                                    className="rounded-md bg-[#111111] dark:bg-[#4e4f50] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#333333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Add Employee
                                </Link>
                            </div>
                        </div>
                        <DataGrids columnsTest={columns} rowsTest={values} />
                    </div>
                </div>
            </div >
        </>
    )
}

const breadCrumbs = [
    // { title: 'Home', href: '/', isLink: true },
    { title: 'Employees', isLink: false },
]