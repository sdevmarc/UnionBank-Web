import './css/Announcement.css'

export default function Announcement({ color, content }) {
    if (!content) return null;
    return (
        <>
            <div className="absolute bottom-0 left-0 w-full h-[5vh] bg-white flex justify-center items-center overflow-x-hidden">
                <div className={`marquee text-[${color}] text-[2rem`} >
                    {content}
                </div>
            </div>
        </>
    )
}
