import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from '@mui/material/Link';
import Breadcrumbs from '@mui/material/Breadcrumbs';

export default function HeaderDashboard({ breadcrumbs }) {
    return (
        <div className="w-full h-[5%] flex justify-start items-center">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" className='text-black dark:text-white' />}>
                {
                    breadcrumbs.map((item, i) =>
                        item?.isLink ? (
                            <Link className='text-black dark:text-white' underline="hover" key={i} fontSize={`.9rem`} href={item?.href}>
                                {item?.title}
                            </Link>
                        ) : (
                            <h1 key={i} className='font-[500] text-[.9rem] text-[#111111] dark:text-white'>
                                {item?.title}
                            </h1>
                        )
                    )}
            </Breadcrumbs>
        </div>
    );
} 