import Logo from '../assets/LogoUB.png'
import { NavLink } from 'react-router-dom'
import './css/Header__Home.css'

export default function Header__Home() {

    // const handleClick = async () => {
    //     try {
    //         const sampleAccountNo = '000000005'
    //         const res = await axios.get(`${VITE_HOST}/api/unionbank/myaccount/auth/${sampleAccountNo}`, {
    //             headers: {
    //                 Authorization: `Bearer ${VITE_ADMIN_TOKEN}`
    //             }
    //         })
    //         const url = res?.data?.url
    //         window.open(url, '_blank', 'width=1080,height=600')
    //     } catch (error) {
    //         console.error()
    //     }
    // }

    return (
        <>
            <div className="fixed w-full max-w-[70rem] h-[8%] flex justify-between items-center z-[20]">
                <div className="homenavs h-full flex justify-start items-center gap-[1rem]">
                    <NavLink to={`/`} className="w-[12rem] h-full">
                        <img src={Logo} alt="Logo" className='w-full h-full object-contain' />
                    </NavLink>
                    <NavLink to={`https://sdevmarc.notion.site/UnionBank-Terms-and-Conditions-85dd31ebb2c34869a3dc59cfc845ec6f`} target='_blank' className='text-[#7ba1bf] font-[500] text-[.9rem] hover:text-white duration-300 ease'>
                        Terms of Use
                    </NavLink>
                    <NavLink to={`https://www.notion.so/sdevmarc/UnionBank-Privacy-Policy-565f098c06044eb4a84baeda6ad5364e`} target='_blank' className='text-[#7ba1bf] font-[500] text-[.9rem] hover:text-white duration-300 ease'>
                        Privacy Policy
                    </NavLink>
                    <NavLink to={`/showcase`} className='text-[#7ba1bf] font-[500] text-[.9rem] hover:text-white duration-300 ease'>
                        Showcase
                    </NavLink>
                </div>

                <div className=" h-full flex justify-end items-center gap-[.7rem] sm:gap-[1rem] md:gap-[1.5rem] lg:gap-[.8rem]">
                    <NavLink to={`/signup`} className='text-white px-[1rem] py-[.6rem] bg-[#1daeef] rounded-xl font-[600] text-[.8rem] hover:bg-[#58caff]'>
                        Sign Up
                    </NavLink>
                    <NavLink to={`/login`} className='text-white px-[1rem] py-[.6rem] border-[1px] border-white rounded-xl font-[500] text-[.8rem]  hover:bg-[#ffffff] hover:text-black'>
                        Login
                    </NavLink>
                </div>
            </div>
        </>
    )
}
