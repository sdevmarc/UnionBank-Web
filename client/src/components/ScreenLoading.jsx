import CircularProgress from '@mui/material/CircularProgress';

export default function ScreenLoading() {
    return (
        <>
            <div className="z-[10] absolute top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.2)] flex justify-center items-center">
                <CircularProgress />
            </div>
        </>
    )
}
