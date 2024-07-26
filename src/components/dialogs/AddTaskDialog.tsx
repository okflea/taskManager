import {
  Dialog, DialogContent,
  DialogDescription, DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { dialogCloseFn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Form, FormField, FormItem, FormMessage } from "../ui/form"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import axios from "axios"
import { toast } from "sonner"
import { useState } from "react"
import LoaderIcon from "@/assets/Loading"
import { useQueryClient } from "@tanstack/react-query"

const formSchema = z.object({
  title: z.string().min(2, { message: "Task must be at least 2 characters" }).max(100, { message: "Task must be at most 100 characters" }),
  description: z.string().max(500, { message: "Task must be at most 500 characters" }).optional(),
})

function AddTaskDialog() {
  const [isLoading, setIsLoading] = useState(false)
  const qc = useQueryClient()
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`, values)
      if (response.status === 201) {
        setIsLoading(false)
        qc.invalidateQueries({ queryKey: ["tasks"] })
        toast.success("Task created")
        form.reset()
        dialogCloseFn()
      }
    } catch (err: any) {
      console.log(err)
      setIsLoading(false)
      if (err.response?.status === 401) {
        toast.error(err.response?.data.error)
        return
      }
      toast.error("something went wrong")
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-400 hover:bg-blue-600 text-slate-100 hover:animate-pulse w-1/4 justify-center p-2 mb-2"
        >
          <PlusCircledIcon className="w-6 h-6 mx-2" /> Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task </DialogTitle>
          <DialogDescription>
            Add a new task
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label>Title</Label>
                  <Input placeholder="Title" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label>Description</Label>
                  <Textarea placeholder="Description" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button
                disabled={isLoading}
                className="bg-blue-400 hover:bg-blue-600 text-slate-100  w-full justify-center p-2 "
                type="submit" >{isLoading ? <LoaderIcon /> : "Save"}</Button>
              <Button
                className="bg-red-400 hover:bg-red-600 text-slate-100  w-full justify-center p-2 "
                onClick={() => {
                  form.reset()
                  dialogCloseFn()
                }}
              >Cancel</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTaskDialog
