import { DeleteAnnouncement, GetAllAnnouncement } from '@/api/Admin'
import DataGrids from '@/components/DataGrids'
import HeaderDashboard from '@/components/Header__dashboard'
import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'

export default function MaintenaceList() {
    const { toast } = useToast()
    const navigate = useNavigate()

    const { data: anouncements = [], refetch: refetchAnnouncements } = useQuery({
        queryFn: () => GetAllAnnouncement(),
        queryKey: ['getallannouncements']
    })

    const { mutateAsync: deleteAnnocement } = useMutation({
        mutationFn: DeleteAnnouncement,
        onSuccess: (data) => {
            if (data?.success) {
                toast({ title: "Success!", description: `${data?.message}` })
                refetchAnnouncements()
                return
            }
            return toast({ title: "Uh, oh! Something went wrong.", description: `${data?.message}` })
        }
    })

    // const { data: searchrbaccounts } = useQuery({
    //     queryFn: () => SearchRbAccounts(search),
    //     queryKey: ['searchRbAccounts', search],
    //     enabled: !!search
    // })

    // useEffect(() => {
    //     if (!credentials && !credentialsLoading) { navigate('/unionbank') }
    // }, [credentials, navigate]);

    const renderViewCell = (params) => {
        return (
            <div className="w-full h-full flex justify-evenly items-center">
                <div className='flex gap-[.5rem]'>
                    <Button variant='secondary' onClick={() => deleteAnnocement({ announcementId: params?.row?.uid })} className="flex justify-center items-center hover:scale-[.98] duration-300 ease">
                        <h1>Delete</h1>
                    </Button>
                </div>

            </div>

        );
    };

    const UserColumns = [
        {
            field: 'id',
            headerName: 'No.',
            width: 120,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'dateFrom',
            headerName: 'From',
            width: 300,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'dateTo',
            headerName: 'To',
            type: 'number',
            width: 300,
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
                    <HeaderDashboard breadcrumbs={breadCrumbs} />
                    <div className="w-full h-[95%] flex flex-col justify-start items-start gap-[1rem]">
                        <div className="w-full h-[5%]">
                            <h1 className='text-black dark:text-white font-[600] text-[1.2rem]'>
                                Maintenance Plans
                            </h1>
                        </div>
                        <div className="w-full h-[5%] flex justify-start items-center gap-[1rem]">
                            <Link
                                to={`/maintenance/create`}
                                className="rounded-md bg-[#4e4f50] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#333333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Create Maintenance
                            </Link>
                        </div>
                        <div className="w-full h-[80%]">
                            <DataGrids columnsTest={UserColumns} rowsTest={anouncements} descCol={`id`} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const breadCrumbs = [
    // { title: 'Home', href: '/', isLink: true },
    { title: 'View Maintenance', isLink: false },
]