import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Button } from '../ui/button';
import { DragHandleDots2Icon, DrawingPinFilledIcon, DrawingPinIcon } from '@radix-ui/react-icons';

interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
}
const Container = ({
  id,
  children,
  title,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'container',
    },
  });
  const [isPinned, setIsPinned] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'w-full h-full p-4 bg-slate-100 rounded-xl flex flex-col gap-y-4 shadow-md',
        isDragging && 'opacity-20  border-4 border-rose-300',
      )}
    >
      <div
        onMouseEnter={() => setIsFocused(true)}
        onMouseOver={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
        className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-gray-800 text-xl">{title}</h1>
          {/* <p className="text-gray-400 text-sm">{description}</p> */}
        </div>
        <div>
          {isFocused &&
            <Button
              variant={"ghost"}
              className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
              onClick={() => setIsPinned(!isPinned)}
            >
              {isPinned ? <DrawingPinFilledIcon /> : <DrawingPinIcon />}
            </Button>
          }
          {!isPinned &&
            <Button
              variant={"ghost"}
              className={`${isDragging ? "cursor-grabbing" : "cursor-grab"} border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl`}
              {...listeners}
            >
              <DragHandleDots2Icon />
            </Button>
          }
          {isPinned &&
            <Button
              disabled
              variant={"ghost"}
              className="border p-2 hover:cursor-none text-xs rounded-xl shadow-lg hover:shadow-xl"
            >
              <DragHandleDots2Icon />
            </Button>
          }
        </div>
      </div>

      {children}
      {/* <Button variant="ghost" onClick={onAddItem}> */}
      {/*   Add Item */}
      {/* </Button> */}
    </div>
  );
};

export default Container;
