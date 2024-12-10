import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
    return (
        <div className="absolute w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.6)] z-[5]">
            <CircularProgress />
        </div>
    )
}
