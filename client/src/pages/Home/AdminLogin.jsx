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

export default function AdminLogin() {
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
    }, [credentials, verify, navigate])

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
            <div className="bg-[#121212] w-full h-screen flex flex-col justify-start items-center">
                <div className="w-full h-full flex justify-start items-center">
                    <div className="w-[70%] h-full flex justify-start items-center">
                        <img src={LoginBG} alt="BG" className='w-full h-full object-cover' />
                    </div>
                    <div className="relative w-[30%] h-full flex justify-center items-center">
                        {loginLoading || otpLoading && <Loading />}
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
