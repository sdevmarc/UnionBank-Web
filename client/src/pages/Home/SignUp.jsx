import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoUB from '../../assets/LogoUB.png'
import LoginBG from '../../assets/LoginBG.png'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { fetchCredentials } from '@/api/Credentials'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchSignUp } from '@/api/User'
import Loading from '@/components/Loading'
import { GetAllAnnouncement } from '@/api/Admin'
import Maintenance from '@/components/__tests__/Maintenance'

export default function SignUp() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [confirmPassword, setConfirmPassword] = useState('')
    const [values, setValues] = useState({
        name: '',
        email: '',
        mobileno: '',
        password: ''
    })

    const { data: credentials, isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['signupCredentials']
    })

    const { data: fetchAnnouncements = [] } = useQuery({
        queryFn: () => GetAllAnnouncement(),
        queryKey: ['testdashboardgetAnnouncements'],
        refetchInterval: 5000
    })

    const { mutateAsync: CreateUser, isPending: createUserLoading } = useMutation({
        mutationFn: fetchSignUp,
        onSuccess: (data) => {
            if (data?.success) {
                toast({ title: "Success!", description: data.message })
                setValues((prev) => ({
                    ...prev,
                    email: '',
                    password: '',
                    name: '',
                    mobileno: ''
                }))
                setConfirmPassword('')
                return
            }
            toast({ title: "Uh oh! Something went wrong.", description: data.message })
        }
    })

    useEffect(() => {
        if (!credentialsLoading && credentials) {
            navigate('/')
        }
    }, [credentials, fetchAnnouncements, navigate])


    const handleSignUp = (e) => {
        try {
            e.preventDefault()
            const { name, email, mobileno, password } = values
            const lowerCasedEmail = email.toLowerCase()

            if (password === confirmPassword) return CreateUser({ name, email: lowerCasedEmail, mobileno, password })
            toast({ title: "Uh oh! Something went wrong.", description: 'Password do not match!' });
            setConfirmPassword('')

        } catch (error) {
            console.error(error)
        }
    }

    const handleLogin = () => {
        navigate('/login')
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOnChangeConfirmPassword = (e) => {
        const { value } = e.target
        setConfirmPassword(value)
    }

    return (
        <>
            {
                fetchAnnouncements.length > 0 &&
                <Maintenance dateFrom={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} dateTo={fetchAnnouncements[fetchAnnouncements.length - 1]?.dateFrom || ''} content={fetchAnnouncements[fetchAnnouncements.length - 1]?.content || ''} />
            }
            <div className="bg-[#121212] w-full h-screen flex flex-col justify-start items-center">
                <div className="w-full h-full flex justify-start items-center">
                    <div className="w-[70%] h-full flex justify-start items-center">
                        <img src={LoginBG} alt="BG" className='w-full h-full object-cover' />
                    </div>
                    <div className="relative w-[30%] h-full flex justify-center items-center">
                        {createUserLoading && <Loading />}
                        <form
                            onSubmit={handleSignUp}
                            className='w-full h-full flex flex-col justify-center items-center gap-[1rem] px-[4rem]'>
                            <div className="w-full h-[5rem] flex justify-start items-center">
                                <img src={LogoUB} alt="BG" className='w-full h-full object-contain' />
                            </div>
                            <div className="w-full flex flex-col">
                                <h1 className='text-white'>Full Name</h1>
                                <input autoFocus onChange={handleOnChange} value={values?.name} name='name' type="text" required className='px-[1rem] py-[.5rem] rounded-md placeholder:text-[.8rem]' placeholder='Enter your full name...' />
                            </div>
                            <div className="w-full flex flex-col">
                                <h1 className='text-white'>Email</h1>
                                <input onChange={handleOnChange} value={values?.email} name='email' type="email" required className='px-[1rem] py-[.5rem] rounded-md placeholder:text-[.8rem]' placeholder='Enter your email...' />
                            </div>
                            <div className="w-full flex flex-col">
                                <h1 className='text-white'>Mobile No.</h1>
                                <input onChange={handleOnChange} value={values?.mobileno} name='mobileno' type="text" required inputMode='numeric' className='px-[1rem] py-[.5rem] rounded-md placeholder:text-[.8rem]' placeholder='Enter your mobile number...' />
                            </div>
                            <div className="w-full flex flex-col">
                                <h1 className='text-white'>Password</h1>
                                <input onChange={handleOnChange} value={values?.password} name='password' type="password" required className='px-[1rem] py-[.5rem] rounded-md placeholder:text-[.8rem]' placeholder='Enter your password...' />
                            </div>
                            <div className="w-full flex flex-col">
                                <h1 className='text-white'>Confirm Password</h1>
                                <input onChange={handleOnChangeConfirmPassword} value={confirmPassword} type="password" required className='px-[1rem] py-[.5rem] rounded-md placeholder:text-[.8rem]' placeholder='Confirm your password' />
                            </div>
                            <button className={`w-full py-[.6rem] rounded-lg ${values?.name && values?.email && values?.mobileno && values?.password && confirmPassword ? 'text-[#ffffff]' : 'text-[#7b7b7b]'} hover:bg-[#007eff] hover:text-white duration-300 ease ${values?.name && values?.email && values?.mobileno && values?.password && confirmPassword ? 'bg-[#007eff]' : 'bg-[#dcdcdc]'} shadow-[_0_10px_15px_-3px_rgba(0,0,0,0.1)]`}>
                                Sign Up
                            </button>
                            <div className="w-full flex flex-col justify-start items-start">
                                <p className='text-[.8rem] text-white'>
                                    Already have an account? <span className='cursor-pointer text-white text-decoration-line: underline' onClick={handleLogin}>Sign In.</span>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}