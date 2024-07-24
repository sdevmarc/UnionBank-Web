import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { MegaphoneIcon } from '@heroicons/react/20/solid'

export default function Maintenance({ dateFrom, dateTo, content, isButton }) {
    const navigate = useNavigate()

    const handleLogout = () => {
        sessionStorage.clear()
        navigate('/unionbank')
    }

    return (
        <>
            <div className="absolute top-0 left-0 w-full h-full bg-[#00000081] flex justify-center items-center z-[10]">
                <div className="w-[30rem] h-[30rem] bg-white dark:bg-[#18191a] rounded-xl flex flex-col justify-between items-center p-[1rem]">
                    <div className="w-full h-full flex flex-col justify-evenly items-center px-[2rem]">
                        <h1 className='text-black dark:text-white text-[1.3rem] font-[500] flex items-center gap-[1rem]'>
                            Scheduled Maintenance Alert <MegaphoneIcon className="size-6 text-black dark:text-white" />
                        </h1>
                        <div className="w-full flex flex-col gap-[1rem] text-[.9rem]">
                            <h1 className='text-black dark:text-white'>Dear Users,</h1>
                            <p className='text-black dark:text-white text-justify text-[.9rem]'>
                                We will be performing scheduled maintenance on our systems from {dateFrom ? dateFrom : '[--]'} to {dateTo ? dateTo : '[--]'}.
                                During this period, our services may be temporarily unavailable.
                                We apologize for any inconvenience this may cause and appreciate your patience as we work to improve our platform.

                            </p>
                            <p className='text-black dark:text-white text-justify text-[.9rem]'>
                                Note: {content ? content : '--'}.
                            </p>
                            <h1 className='text-black dark:text-white text-[.9rem]'> Thank you for your understanding.</h1>
                        </div>

                    </div>
                    {
                        isButton && <Button onClick={handleLogout} className='w-full' variant='secondary'>
                            Logout
                        </Button>
                    }

                </div>
            </div>
        </>
    )
}