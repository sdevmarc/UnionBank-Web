import { NavLink } from "react-router-dom";
import DropdownMenu from "../DropdownMenu";
import { DrawerTransfer } from "../DrawerTransfer"
import { ModeToggle } from "../DarkModeToggle";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { NotificationPopover } from "../NotificationPopover";
import Badge from '@mui/material/Badge';

export default function Header() {
    return (
        <>
            <div className="z-[2] backdrop-blur-[.2rem] fixed top-0 w-full max-w-[80rem] h-[8dvh] flex justify-between items-center gap-[1rem] border-b border-gray-900/10">
                <div className="newheader flex justify-start items-center gap-[1.3rem]">
                    <AccountBalanceIcon className="text-black dark:text-white" style={{ fontSize: '2rem' }} />
                    <NavLink to={`/`} className={`text-[.9rem] font-[400]`}>
                        Dashboard
                    </NavLink>
                    <NavLink to={`/statement`} className={`text-[.9rem] font-[400]`}>
                        View Statement
                    </NavLink>
                    {/* <NavLink to={`/test/statement`} className={`text-[.9rem] font-[400]`}>
                        Analytics
                    </NavLink> */}
                </div>
                <div className="flex justify-end items-center gap-[1.3rem]">
                    <ModeToggle />
                    <Badge color="secondary" variant="dot" invisible={false}>
                        <NotificationPopover />
                    </Badge>
                    <DrawerTransfer />
                    <DropdownMenu />
                </div>
            </div>
        </>
    )
}
