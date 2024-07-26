import { closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import Container from './Container';
import Items from './Items';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import AddTaskDialog from '../dialogs/AddTaskDialog';

type Task = {
  id: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  column: string;
  // Add any other properties you need
};

type Column = {
  id: string;
  title: string;
  items: Task[];
};

function Board() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const getTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`);
      const tasks: Task[] = res.data;

      const newContainers: Column[] = containers.map(container => ({
        ...container,
        items: tasks
          .filter(task => task.column === container.id)
          .sort((a, b) => a.order - b.order)
          .map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            order: task.order,
            createdAt: task.createdAt,
            column: task.column,
            // Add any other properties you need for your UI
          }))
      }));

      setContainers(newContainers);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  };
  const { data, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  })
  const [containers, setContainers] = useState<Column[]>([
    { id: 'TODO', title: 'To Do', items: [] },
    { id: 'INPROGRESS', title: 'In Progress', items: [] },
    { id: 'DONE', title: 'Done', items: [] },
  ]);
  //helper
  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === 'container') {
      return containers.find((item) => item.id === id);
    }
    if (type === 'item') {
      return containers.find((container) =>
        container.items.find((item) => item.id === id),
      );
    }
  }


  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return '';
    return container.title;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return [];
    return container.items;
  };

  //Dnd handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }


  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over, collisions } = event;

    if (!over) return;
    // if (active.id === over.id) return;

    const activeContainer = containers.find(container =>
      container.items.some(item => item.id === active.id)
    );
    const overContainerId = collisions?.find((coll: any) =>
      coll.id.toString().includes('TODO') ||
      coll.id.toString().includes('INPROGRESS') ||
      coll.id.toString().includes('DONE')
    )?.id
    console.log("overContainerId", overContainerId);

    const overContainer = containers.find(container => container.id === overContainerId);

    if (!activeContainer || !overContainerId) return;

    try {
      const activeTask = activeContainer.items.find(item => item.id === active.id);
      if (!activeTask) return;

      const newColumn = overContainerId;
      let newOrder;

      if (over.id === overContainerId) {
        // Dropped directly into a column
        newOrder = containers.find(container => container.id === overContainerId)?.items.length || 0;
      } else {
        // Dropped onto another task
        const overTaskIndex = containers.find(container => container.id === overContainerId)?.items.findIndex(item => item.id === over.id) || 0;
        newOrder = overTaskIndex !== -1 ? overContainer?.items[overTaskIndex].order : 0;
      }

      // Send update to backend
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${activeTask.id}`, {
        column: newColumn,
        order: newOrder,
        title: activeTask.title,
        description: activeTask.description,
      });
      console.log("put req");

      // Fetch the latest data
      await refetch();
    } catch (error) {
      console.error('Error updating task:', error);
    }

    setActiveId(null);
  }
  const activeTask = (id: string | UniqueIdentifier) => {
    return data?.find((task) => task.id === id);
  }

  return (
    <div className='p-4'>
      <AddTaskDialog />
      <div className='grid grid-cols-3 gap-6'>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}

        >
          <SortableContext
            items={containers.map((container) => container.id)}
          >
            {containers.map((container) => (
              <Container
                key={container.id}
                title={container.title}
                id={container.id}
              >
                <SortableContext items={container.items.map((item) => item.id)}>
                  <div className='flex items-start flex-col gap-y-4'></div>
                  {container.items.map((item) => (
                    <Items
                      key={item.id}
                      task={activeTask(item.id)}
                    />
                  ))}
                </SortableContext>

              </Container>
            ))}
          </SortableContext>
          <DragOverlay adjustScale={false}>
            {/* Drag Overlay For item Item */}
            {activeId && activeId.toString().includes('item') && (
              <Items
                task={activeTask(activeId)}
              />
            )}
            {/* Drag Overlay For Container */}
            {activeId && activeId.toString().includes('container') && (
              <Container id={activeId} title={findContainerTitle(activeId)}>
                {findContainerItems(activeId).map((i) => (
                  <Items
                    key={i.id}
                    task={activeTask(i.id)}
                  />
                ))}
              </Container>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div >
  )
}

export default Board
