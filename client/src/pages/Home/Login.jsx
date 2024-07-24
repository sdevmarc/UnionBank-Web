import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoUB from '../../assets/LogoUB.png'
import LoginBG from '../../assets/LoginBG.png'
import { useToast } from "@/components/ui/use-toast"
import { InputOTPForm } from '@/components/OTP'
import Loading from '@/components/Loading'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchCredentials } from '@/api/Credentials'
import { fetchLoginUser, fetchOtp } from '@/api/User'
import { GetAllAnnouncement } from '@/api/Admin'
import Maintenance from '@/components/__tests__/Maintenance'

export default function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const [verify, setVerify] = useState(false)
    const navigate = useNavigate()
    const { toast } = useToast()

    const { data: credentials = '', isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['loginCredentials']
    })

    const { data: fetchAnnouncements = [], isLoading: announcementLoading } = useQuery({
        queryFn: () => GetAllAnnouncement(),
        queryKey: ['testdashboardgetAnnouncements'],
        refetchInterval: 5000
    })

    const { mutateAsync: LoginUser, isPending: loginLoading } = useMutation({
        mutationFn: fetchLoginUser,
        onSuccess: (data) => {
            if (!data?.success) return toast({ title: "Uh oh! Something went wrong.", description: data?.message })
            if (!data?.user?.isactive) {
                setVerify(true)
                toast({ title: "2-Factor-Authentication", description: 'A one-time-password has been sent to your email!' })
                return
            }
            const token = data.token
            const userId = data.userId
            const role = data.role

            sessionStorage.setItem('credentials', JSON.stringify({ token, userId, role }))
            navigate('/')
        }
    })

    const { mutateAsync: OTPUser, isPending: otpLoading } = useMutation({
        mutationFn: fetchOtp,
        onSuccess: (data) => {
            if (data?.success) {
                const token = data?.token
                const userId = data?.userId
                const role = data?.role
                sessionStorage.setItem('credentials', JSON.stringify({ token, userId, role }))

                toast({ title: "Yay! Success.", description: 'You have been verified.', });
                navigate('/')
                return
            }
            toast({ title: "Uh, oh! Something went wrongs.", description: data?.message, });
        }
    })

    const handleOtpSubmit = (pin) => {
        OTPUser({ otp: pin })
    }

    useEffect(() => {
        if (!credentialsLoading && credentials) {
            setVerify(false)
            navigate('/')
        }
    }, [credentials, verify, fetchAnnouncements, navigate])

    const handleLogin = (e) => {
        e.preventDefault()
        const { email, password } = values
        LoginUser({ email, password })
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSignUp = () => {
        navigate('/signup')
    }

    return (
        <>
            {
                fetchAnnouncements.length > 0 &&
                <Maintenance dateFrom={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} dateTo={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} content={fetchAnnouncements[fetchAnnouncements.length - 1]?.content || ''} />
            }
            <div className="bg-[#121212] w-full h-screen flex flex-col justify-start items-center">
                <div className="w-full h-full flex justify-start items-center">
                    <div className="relative w-[70%] h-full flex justify-start items-center">
                        <div className="w-full h-full flex justify-start items-center">
                            <img src={LoginBG} alt="BG" className='w-full h-full object-cover' />
                        </div>
                        <div className="absolute w-full h-full flex flex-col justify-center items-center gap-[1rem]">
                            <div className="rotate-[-5deg] backdrop-blur-[.5rem] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.3)] px-[1rem] rounded-xl w-[29rem] h-[35rem] flex flex-col justify-center items-center gap-[1rem]">
                                <div className="w-full flex justify-between items-center">
                                    <h1 className='text-white text-[1.5rem] font-[600]'>ROLE</h1>
                                    <h1 className='text-white text-[1.5rem] font-[600]'>CREDENTIALS</h1>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <h1 className='text-white'>ADMIN</h1>
                                    <div className="flex flex-col justify-center items-end gap-[.5rem]">
                                        <h1 className='text-white'>admin@gmail.com</h1>
                                        <h1 className='text-white'>admin</h1>
                                    </div>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <h1 className='text-white'>HUMAN RESOURCE</h1>
                                    <div className="flex flex-col justify-center items-end gap-[.5rem]">
                                        <h1 className='text-white'>hr@gmail.com</h1>
                                        <h1 className='text-white'>hr</h1>
                                    </div>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <h1 className='text-white'>IT Department</h1>
                                    <div className="flex flex-col justify-center items-end gap-[.5rem]">
                                        <h1 className='text-white'>it@gmail.com</h1>
                                        <h1 className='text-white'>it</h1>
                                    </div>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <h1 className='text-white'>RETAIL BANK</h1>
                                    <div className="flex flex-col justify-center items-end gap-[.5rem]">
                                        <h1 className='text-white'>rb@gmail.com</h1>
                                        <h1 className='text-white'>rb</h1>
                                    </div>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <h1 className='text-white'>USER</h1>
                                    <div className="flex flex-col justify-center items-end gap-[.5rem]">
                                        <h1 className='text-white'>user@gmail.com</h1>
                                        <h1 className='text-white'>user</h1>
                                    </div>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                    <h1 className='text-white'>USER</h1>
                                    <div className="flex flex-col justify-center items-end gap-[.5rem]">
                                        <h1 className='text-white'>yourparengmarc@gmail.com</h1>
                                        <h1 className='text-white'>123</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-[30%] h-full flex justify-center items-center">
                        {(loginLoading || otpLoading) && <Loading />}
                        {
                            verify ? <InputOTPForm isVerify={(data) => setVerify(data)} pin={(handleOtpSubmit)} /> :
                                <form
                                    onSubmit={handleLogin}
                                    className='w-full h-full flex flex-col justify-center items-center gap-[1rem] px-[4rem]'>
                                    <div className="w-full h-[5rem] flex justify-start items-center">
                                        <img src={LogoUB} alt="BG" className='w-full h-full object-contain' />
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <h1 className='text-white'>Email</h1>
                                        <input autoFocus onChange={handleOnChange} type="email" required name='email' className='px-[1rem] py-[.5rem] rounded-md placeholder:text-[.8rem]' placeholder='Enter your email...' />
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <h1 className='text-white'>Password</h1>
                                        <input onChange={handleOnChange} type="password" required name='password' className='px-[1rem] py-[.5rem] rounded-md placeholder:text-[.8rem]' placeholder='Enter your password...' />
                                    </div>
                                    <button type='submit' className={`w-full py-[.6rem] rounded-lg  ${values?.email && values?.password ? 'text-[#ffffff]' : 'text-[#7b7b7b]'} hover:bg-[#007eff] hover:text-white duration-300 ease ${values?.email && values?.password ? 'bg-[#007eff]' : 'bg-[#dcdcdc]'} shadow-[_0_10px_15px_-3px_rgba(0,0,0,0.1)]`}>
                                        Login
                                    </button>
                                    <div className="w-full flex flex-col justify-start items-start">
                                        <p className='text-[.8rem] text-white'>
                                            Don't have an account? <span className='cursor-pointer text-white text-decoration-line: underline' onClick={handleSignUp}>Sign Up.</span>
                                        </p>
                                        <p className='cursor-pointer text-[.8rem] text-decoration-line: underline text-white'>
                                            Forgot password?
                                        </p>
                                    </div>
                                </form>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
