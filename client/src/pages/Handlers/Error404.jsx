import Header__Home from '@/components/Header__Home'
import Lottie from "lottie-react";
import LottieError from '../../assets/Error.json'

export default function Error404() {
    return (
        <>
            <dic className="w-full h-screen flex flex-col bg-[#111111]">
                <Header__Home />
                <div className="w-full h-full flex justify-center items-center gap-[2rem]">
                    <div className='flex flex-col justify-center items-start'>
                        <h1 className='text-white text-[1.5rem] font-[500]'>You are on the wrong track!</h1>
                        <h1 className='text-white text-[3rem] font-bold'>404 Error: Page Not Found.</h1>
                    </div>
                    <div className="w-[20rem] h-[20rem]">
                        <Lottie animationData={LottieError} />
                    </div>
                </div>
            </dic>
        </>
    )
}
