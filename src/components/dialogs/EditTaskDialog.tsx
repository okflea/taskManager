import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil2Icon } from "@radix-ui/react-icons"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { dialogCloseFn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import LoaderIcon from "@/assets/Loading"

type Task = {
  id: string
  title: string
  description?: string
  order: number
  column: string
}
interface Props {
  task: Task
}
const formSchema = z.object({
  title: z.string().min(2, { message: "Task must be at least 2 characters" }),
  description: z.string()
    .min(2, { message: "Description must be at least 2 characters" })
    .max(500, { message: "Description must be at most 500 characters" })
    .optional()
})

function EditTaskDialog({ task }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const qc = useQueryClient()
  const form = useForm({
    defaultValues: {
      title: task.title,
      description: task?.description,
    },
    resolver: zodResolver(formSchema),
  })

  async function updateTask(task: Task, values: z.infer<typeof formSchema>) {
    const { title, description } = values
    try {

      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task.id}`, {
        title,
        description,
        order: task.order,
        column: task.column
      })
      setIsLoading(false)
      if (res.status === 200) {
        qc.invalidateQueries({ queryKey: ["tasks"] })
        form.reset()
        toast.success("Task updated")
        dialogCloseFn()

      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    updateTask(task, values)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="opacity-80 hover:opacity-100 p-2" variant={"secondary"}>
          <Pencil2Icon /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your Task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* <div className="grid gap-4 py-4"> */}
        {/*   <div className="grid grid-cols-4 items-center gap-4"> */}
        {/*     <Label htmlFor="username" className="text-right"> */}
        {/*       Description */}
        {/*     </Label> */}
        {/*     <Input id="task" value={`${task.content}`} className="col-span-3" /> */}
        {/*   </div> */}
        {/* </div> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  {/* <Label>Task</Label> */}
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
                  {/* <Label>Task</Label> */}
                  <Textarea placeholder="Description" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="w-full bg-blue-500 hover:bg-blue-600">{isLoading ? <LoaderIcon /> : "Save"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTaskDialog
