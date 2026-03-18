import type { Task } from "../models/tasks";

interface TasksListProps {
    tasks: Task[];
    onToggle: (id: number, current: boolean) => void;
    onDelete: (id: number) => void;
}

function TaskList({ tasks, onToggle, onDelete }: TasksListProps) {
    if (!tasks || tasks.length === 0) {
        return <p>Aucune tâche à afficher</p>;
    }

  return (
    <div className="tasks">
        <ul>
            {tasks.map((task) => (
                // nom de classe différente en fonction de l'état de la tâche
                // pour gérer le style
                <li className={`flex items-center gap-2 border border-gray-200 rounded p-2 my-2
                        ${task.is_completed ? "line-through text-gray-400" : ""}`}
                    key={task.id}
                >
                    <input
                        type="checkbox"
                        checked={task.is_completed}
                        onChange={() => onToggle(task.id, task.is_completed)}
                    />
                    <span className="flex-1">
                        {task.description} ({task.category.name})
                    </span>
                    <button onClick={() => onDelete(task.id)}>Supprimer</button>
                </li>
            ))}
        </ul>
    </div>
  );
}

export default TaskList;
