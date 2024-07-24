import { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar';
import Header__Dashboard from '../../../components/Header__dashboard';
import DataGrids from '../../../components/DataGrids';
import Toggle from '../../../components/Toggle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const { VITE_HOST, VITE_ADMIN_TOKEN } = import.meta.env

export default function Developers() {
    const [values, setValues] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchCredentials()
        fetchDeveloperUsers()
    }, [])

    const fetchCredentials = () => {
        try {
            const credentials = sessionStorage.getItem('credentials')
            if (!credentials) return navigate('/unionbank')
        } catch (error) {
            console.error(error)
        }
    }

    const fetchDeveloperUsers = async () => {
        try {
            const res = await axios.get(`${VITE_HOST}/api/developerusers`, {
                headers: {
                    Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
                }
            })

            const developers = res?.data?.data
            const formattedData = developers.map((acc, index) => ({
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

            if (value === '') return fetchDeveloperUsers()

            const res = await axios.get(`${VITE_HOST}/api/searchrdeveloperusers/${value}`, {
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

    const developerCol = [
        {
            field: 'id',
            headerName: 'No.',
            width: 90,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'uid',
            headerName: 'ID',
            width: 200,
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
        }
    ];

    return (
        <>
            <div className="flex bg-white dark:bg-[#242526]">
                <Sidebar />
                <div className="w-[80%] h-screen flex flex-col justify-start items-start p-[1rem] overflow-hidden">
                    <Header__Dashboard breadcrumbs={breadCrumbs} />
                    <div className="w-full h-[95%] flex flex-col gap-[1rem]">
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
                        <DataGrids columnsTest={developerCol} rowsTest={values} />
                    </div>
                </div>
            </div >
        </>
    )
}

const breadCrumbs = [
    // { title: 'Home', href: '/', isLink: true },
    { title: 'Developers', isLink: false },
]