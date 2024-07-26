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
import { CalendarIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons"
import { Task } from "@/lib/types"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { formatDateTime } from "@/lib/utils"

interface Props {
  task: Task
}

function ViewTaskDialog({ task }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 opacity-80 hover:bg-blue-600 p-2">
          <OpenInNewWindowIcon /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>
            <p className="text-sm">Description :</p>
            <p className="text-blue-600">
              {task.description}
            </p>
          </DialogDescription>
          <Badge variant={"secondary"} className="gap-2">
            <CalendarIcon /> {formatDateTime(task.createdAt)}
          </Badge>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={"secondary"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ViewTaskDialog
