import { fetchCredentials } from "@/api/Credentials"
import { fetchNotifications } from "@/api/User"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useQuery } from "@tanstack/react-query"

export function NotificationPopover() {
    const { data: credentials = '', isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['notificationsCredentials']
    })

    const userId = credentials?.userId

    const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
        queryFn: () => fetchNotifications({ userId }),
        queryKey: ['notifications', { userId }],
        enabled: !!userId,
        refetchInterval: 5000
    })

    return (
        <Popover>
            <PopoverTrigger asChild>
                <NotificationsIcon className="text-[#18191a] cursor-pointer dark:text-white" style={{ fontSize: '1.7rem' }} />
            </PopoverTrigger>
            <PopoverContent className="w-[25rem] h-full max-h-[30rem] overflow-auto">
                <div className="w-full pb-[1rem]">
                    <h1 className="text-[1.2rem] font-[500]">Notifications</h1>
                </div>
                <div className="w-full flex flex-col gap-[.4rem]">
                    {
                        !notificationsLoading && notifications.length > 0 ?
                            notifications
                                .slice(-10) // Get the last 10 items
                                .reverse()
                                .map((item) => (
                                    <div key={item?._id} className="dark:bg-[#242526] w-full py-[.5rem] bg-[#e0dede] p-[.5rem] rounded-sm flex flex-col justify-evenly items-center cursor-default">
                                        <div className="w-full flex justify-between items-center">
                                            <h1 className="text-[.85rem]">
                                                {item?.type === 'login' && '🎉 New Login Attempt!'}
                                                {item?.type === 'deposit' && '🎉 Deposit Received'}
                                                {item?.type === 'withdrawal' && '🎉 Withdrawal Successful'}
                                                {item?.type === 'transfer_debit' && '🎉 Payment Successful'}
                                                {item?.type === 'transfer_credit' && '🎉 Money Transfer Received'}
                                                {/* 🎉 Payment Successful! */}
                                            </h1>
                                            <h1 className="text-[.7rem]">  4 minutes ago.</h1>
                                        </div>
                                        <div className="w-full px-[1.5rem]">
                                            <h1 className="text-[.7rem] text-justify">
                                                {item?.content}
                                            </h1>
                                        </div>
                                    </div>
                                ))
                            : <div className="w-full h-[5rem] p-[.5rem] rounded-sm flex flex-col justify-evenly items-center cursor-default">
                                <h1 className="text-[.85rem]">Nothing around here...</h1>
                            </div>
                    }
                </div>
            </PopoverContent>
        </Popover>
    )
}
