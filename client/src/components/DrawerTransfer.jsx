import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchTransfer } from "@/api/Transactions";
import { fetchCredentials } from "@/api/Credentials";
import { fetchAccount } from "@/api/Accounts";
import { useToast } from "@/components/ui/use-toast"

export function DrawerTransfer() {
    const { toast } = useToast()
    const closeDrawerRef = useRef(null);
    const [values, setValues] = useState({
        creditAccount: '',
        amount: ''
    })

    const { data: credentials = '', isLoading: credentialsLoading } = useQuery({
        queryFn: () => fetchCredentials(),
        queryKey: ['credentialsDrawerTransfer']
    })

    const userId = credentials?.userId
    const token = credentials?.token

    const { data: account = '', isLoading: accountLoading } = useQuery({
        queryFn: () => fetchAccount({ userId }),
        queryKey: ['accountsDrawerTransfer', { userId }],
        enabled: !!userId
    })

    const accountno = account?.accountno

    const { mutateAsync: Transfer, isPending: transferLoading } = useMutation({
        mutationFn: fetchTransfer,
        onSuccess: (data) => {
            if (data?.success) return toast({ title: "Success! 🎉", description: data?.message })
            toast({ title: "Uh, oh! Something went wrong.", description: data?.message, })
        }
    })

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            await Transfer({ debitAccount: accountno, creditAccount: values?.creditAccount, amount: values?.amount, token, userId })
        } catch (error) {
            console.error(error)
        } finally {
            handleCleanUp()
            closeDrawerRef.current?.click()
        }
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCleanUp = () => {
        setValues((prev) => ({
            ...prev,
            creditAccount: '',
            amount: ''
        }))
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="secondary">Make a transfer</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Make a transfer</DrawerTitle>
                        <DrawerDescription>Please fill-up the required fields</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <form onSubmit={handleSubmit}>
                            <div className="w-full flex flex-col justify-center items-start gap-[1rem]">
                                <div className="w-full flex flex-col gap-[.4rem]">
                                    <h1 className="text-[.9rem] font-[500]">Transfer from</h1>
                                    <div className="w-full flex justify-start items-start">
                                        <input
                                            value={accountno}
                                            required
                                            type="text"
                                            name="debitAccount"
                                            placeholder="Account number"
                                            readOnly
                                            className="w-full text-center text-black px-[.7rem] py-1.5 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none border-[1px] border-[#a2a2a2] rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-[.4rem]">
                                    <h1 className="text-[.9rem] font-[500]">Transfer to</h1>
                                    <div className="w-full flex justify-start items-start">
                                        <input
                                            autoFocus
                                            value={values?.creditAccount}
                                            onChange={handleOnChange}
                                            required
                                            type="text"
                                            name="creditAccount"
                                            className="w-full text-center text-black px-[.7rem] py-1.5 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none border-[1px] border-[#111111] rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-[.4rem]">
                                    <h1 className="text-[.9rem] font-[500]">Amount</h1>
                                    <div className="w-full flex justify-start items-start">
                                        <input
                                            value={values?.amount}
                                            onChange={handleOnChange}
                                            required
                                            type="text"
                                            name="amount"
                                            className="w-full text-center text-black px-[.7rem] py-1.5 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none border-[1px] border-[#111111] rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DrawerFooter>
                                <Button>Submit</Button>
                                <DrawerClose ref={closeDrawerRef} asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
