import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { CalendarIcon, DragHandleDots2Icon, DrawingPinFilledIcon, DrawingPinIcon, OpenInNewWindowIcon, ReaderIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import EditTaskDialog from '../dialogs/EditTaskDialog';
import DeletetaskDialog from '../dialogs/DeleteTaskDialog';
import ViewTaskDialog from '../dialogs/ViewTaskDialog';
import { formatDateTime } from '@/lib/utils';

type ItemsType = {
  id: string;
  title: string;
  description?: string;
  createdAt: string
  order: number;
  column: string;
};

interface Props {
  task?: ItemsType;
}
const Items = ({ task }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task?.id || '',
    data: {
      type: 'item',
    },
  });
  const [isPinned, setIsPinned] = React.useState(false);
  const [isFocusedPin, setIsFocusedPin] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setIsFocused(true)}
      onMouseOver={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'hover:border-sky-600 px-2 py-4 bg-gradient-to-br from-blue-300 to-blue-200  rounded-xl w-full border-2 border-transparent  shadow-md',
        isDragging && 'opacity-20 cursor-grabbing border-4 border-rose-300',
      )}
    >
      <div className='flex flex-col'>
        <div
          onMouseEnter={() => setIsFocusedPin(true)}
          onMouseOver={() => setIsFocusedPin(true)}
          onMouseLeave={() => setIsFocusedPin(false)}
          className="flex items-center justify-between pb-3 px-4">
          <p className='text-lg text-slate-50 font-semibold'>
            {task?.title}
          </p>
          <div className='flex gap-1'>
            {isFocusedPin &&
              <Button
                variant={"secondary"}
                className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
                onClick={() => setIsPinned(!isPinned)}
              >
                {isPinned ? <DrawingPinFilledIcon /> : <DrawingPinIcon />}
              </Button>
            }
            {!isPinned &&
              <Button
                variant={"secondary"}
                className={`${isDragging ? "cursor-grabbing" : "cursor-grab"} border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl`}
                {...listeners}
              >
                <DragHandleDots2Icon />
              </Button>
            }
            {isPinned &&
              <Button
                disabled
                variant={"secondary"}
                className="border p-2 hover:cursor-none text-xs rounded-xl shadow-lg hover:shadow-xl"
              >
                <DragHandleDots2Icon />
              </Button>
            }
          </div>
        </div>

        <CardContent className="gap-2 flex flex-col">

          <Badge variant={"secondary"} className="text-xs font-light w-full my-auto h-[100px] overflow-y-auto overflow-x-hidden whitespace-pre-wrap gap-2 task">
            <ReaderIcon />{task?.description}
          </Badge>
          <Badge variant={"secondary"} className="gap-2">
            <CalendarIcon /> {formatDateTime(task?.createdAt)}
          </Badge>
        </CardContent>
        <CardFooter className="mx-auto gap-2">
          {(isFocused && task !== undefined) && (
            <>
              <DeletetaskDialog taskId={task.id} />
              <EditTaskDialog task={task} />
              <ViewTaskDialog task={task} />
            </>
          )}
          {!isFocused && (
            <>
              <Button disabled className="invisible"><OpenInNewWindowIcon className="w-5 h-5" /></Button>
            </>
          )}
        </CardFooter>
      </div>
    </div>
  );
};

export default Items;
