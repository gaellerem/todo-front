import React from 'react';

export interface Task {
  label: string;
  category: string;
  done: boolean;
}

interface Props {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

function TaskList({ tasks, setTasks }: Props) {
  if (!tasks || tasks.length === 0) {
    return <p>Aucune tâche à afficher</p>;
  }

  const handleCheck = (index: number) => {
    // modifie la tâche à l'index donné
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  };

  const handleDelete = (index: number) => {
    // supprime la tâche à l'index donné
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="tasks">
      <ul>
        {tasks.map((task, index) => (
          // nom de classe différente en fonction de l'état de la tâche
          // pour gérer le style
          <li className={`task-card${task.done ? " done" : ""}`} key={index}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => handleCheck(index)}
            />
            <span>
              {task.label} ({task.category})
            </span>
            <button onClick={() => handleDelete(index)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
