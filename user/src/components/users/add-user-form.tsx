"use client"

import "react-phone-number-input/style.css"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import api from "@/lib/api"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().refine((val) => val && isValidPhoneNumber(val), {
        message: "Invalid phone number",
    }),
    profileUrl: z.string().url({
        message: "Please enter a valid URL.",
    }).optional().or(z.literal("")),
    dob: z.string().optional(),
})

interface AddUserFormProps {
    onSuccess?: () => void;
}

export function AddUserForm({ onSuccess }: AddUserFormProps) {
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            profileUrl: "",
            dob: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await api.post("/user/create", values)
            form.reset()
            setOpen(false)
            if (onSuccess) onSuccess()
        } catch (error: any) {
            console.error("Failed to create user", error)
            const message = error.response?.data?.message || "Failed to create user. Please try again."
            toast.error(message)
        }
    }

    const today = new Date().toISOString().split("T")[0]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                        Create a new user profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            placeholder="Enter phone number"
                                            value={field.value}
                                            onChange={(value) => field.onChange(value || "")}
                                            defaultCountry="US"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="profileUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Portfolio URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://github.com/johndoe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            max={today}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
