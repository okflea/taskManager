import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "@radix-ui/react-icons"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useState } from "react"
import LoaderIcon from "@/assets/Loading"

interface Props {
  taskId: string
}

function DeletetaskDialog({ taskId }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const qc = useQueryClient()
  async function deleteTask(taskId: string) {
    setIsLoading(true)
    try {

      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}`)
      setIsLoading(false)
      if (res.status === 200) {
        toast.success('Task deleted')
        qc.invalidateQueries({ queryKey: ["tasks"] })
      }
    } catch (e) {
      setIsLoading(false)
      toast.error('Error deleting task')
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="opacity-80 hover:opacity-100 p-2" variant={"destructive"} >
          <TrashIcon /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            disabled={isLoading}
            variant={"destructive"} onClick={() => deleteTask(taskId)}
          >{isLoading ? <LoaderIcon /> : "Delete"}</Button>
          <DialogClose asChild>
            <Button type="button" variant={"secondary"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeletetaskDialog
