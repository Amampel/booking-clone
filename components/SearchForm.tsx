'use client'
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "./ui/form";
import { BedDoubleIcon } from "lucide-react";
import { Input } from "./ui/input";
// import { } from "@headlessui/react";
import { PopoverTrigger, Popover, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

export const formSchema = z.object({
    location: z.string().min(2, {
        message: "Must be at least 2 characters or more"
    }).max(50),
    dates: z.object({
        from: z.date({ required_error: "Please select a check-in date" }),
        to: z.date({ required_error: "Please select a check-out date" })
    }),
    adults: z.string().min(1, {
        message: "Please select at least 1 adult"
    }).max(12, {
        message: "Max 12 adults",
    }),
    childrens: z.string().min(0).max(12, {
        message: "Max 12 Children"
    }),
    rooms: z.string().min(1, {
        message: "Please select at least 1 room"
    })
})
function SearchForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            location: "",
            dates: {
                from: undefined,
                to: undefined
            },
            adults: "1",
            childrens: "",
            rooms: "1"
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const checkin_monthday = values.dates.from.getDate().toString()
        const checkin_month = (values.dates.from.getMonth() + 1).toString()
        const checkin_year = values.dates.from.getFullYear().toString()
        const checkout_monthday = values.dates.to.getDate().toString()
        const checkout_month = (values.dates.to.getMonth() + 1).toString()
        const checkout_year = values.dates.to.getFullYear().toString()

        const checkin = `${checkin_year}-${checkin_month}-${checkin_monthday}`
        const checkout = `${checkout_year}-${checkout_month}-${checkout_monthday}`

        const url = new URL("https://www.booking.com/searchresults.html")
        url.searchParams.set("ss", values.location)
        url.searchParams.set("group_adults", values.adults)
        url.searchParams.set("group_children", values.childrens)
        url.searchParams.set("no_rooms", values.rooms)
        url.searchParams.set("checkin", checkin)
        url.searchParams.set("checkout", checkout)

        router.push(`/search?url=${url.href}`)
    }
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row lg:max-w-7xl items-center justify-center space-x-0 lg:space-x-2 space-y-4 lg:space-y-0 rounded-lg">
            <div className="grid w-full lg:max-w-sm items-center gap-1.5">
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white flex">
                                Location
                                <BedDoubleIcon className="ml-2 h-4 w-4 text-white" />
                            </FormLabel>
                            <FormMessage />
                            <FormControl>
                                <Input placeholder="London, UK" {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
            </div>
            <div className="grid w-full lg:max-w-sm flex-1 items-center gap-1.5">
                <FormField control={form.control} name="dates" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel className="text-white">Dates</FormLabel>
                        <FormMessage />
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        id="date"
                                        name="dates"
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal",
                                            !field.value.from && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-3 h-4 w-4 opacity-50" />
                                        {field.value?.from ? (
                                            field.value.to ? (
                                                <>
                                                    {format(field.value?.from, "LLL dd, y")} - {" "}
                                                    {format(field.value?.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(field.value?.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Select your dates</span>
                                        )}
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    selected={field.value}
                                    defaultMonth={field.value.from}
                                    onSelect={field.onChange}
                                    numberOfMonths={2}
                                    disabled={(date) =>
                                        date < new Date(new Date().setHours(0, 0, 0, 0))} />

                            </PopoverContent>
                        </Popover>
                    </FormItem>
                )}></FormField>
            </div>
            <div className="flex w-full items-center space-x-2">
                <div className="grid items-center flex-1">
                    <FormField control={form.control}
                        name="adults"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-white">Adults</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input type="number" placeholder="Adults" {...field} />
                                </FormControl>
                            </FormItem>
                        )}>

                    </FormField>
                </div>
                <div className="grid items-center flex-1">
                    <FormField control={form.control}
                        name="childrens"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-white">Childrens</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input type="number" placeholder="Childrens" {...field} />
                                </FormControl>
                            </FormItem>
                        )}>

                    </FormField>
                </div>
                <div className="grid items-center flex-1">
                    <FormField control={form.control}
                        name="rooms"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-white">Rooms</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input type="number" placeholder="Rooms" {...field} />
                                </FormControl>
                            </FormItem>
                        )}>

                    </FormField>
                </div>
                <div className="mt-auto">
                    <Button type="submit" className="bg-blue-500 text-base">
                        Search
                    </Button>
                </div>
            </div>
        </form>
    </Form>
}

export default SearchForm