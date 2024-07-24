import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
});

export function InputOTPForm({ isVerify, pin }) {
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    });

    async function onSubmit(data) {
        try {
            pin(data.pin)
        } catch (error) {
            console.error(error)
        }
    }

    const handleCancel = () => {
        isVerify(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)(e);
            }} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-white'>One-Time Password</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription>
                                Please enter the one-time password sent to your email.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="w-full flex justify-start items-center gap-[1rem]">
                    <button type="button" onClick={handleCancel} className='text-white px-[1rem] py-[.6rem] border-[1px] border-white rounded-xl font-[500] text-[.8rem]  hover:bg-[#ffffff] hover:text-black'>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className='text-white px-[1rem] py-[.6rem] bg-[#1daeef] rounded-xl font-[600] text-[.8rem] hover:bg-[#58caff]'>
                        Submit
                    </button>
                </div>

            </form>
        </Form>
    );
}
