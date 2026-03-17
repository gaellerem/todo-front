import React, { useState } from "react";
import CategoriesOptions from "./CategoriesOptions";
import TaskList from "./TaskList";
import type { Task } from "./TaskList";

function ToDo() {
  const [newCategory, setNewCategory] = useState<string>("");
  const [errorCategory, setErrorCategory] = useState<string>("");
  const [newTask, setNewTask] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selected, setSelected] = useState<string>("");

  const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
    // eviter l'envoi du formulaire
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (categories.includes(trimmed)) {
      // affiche message d'erreur
      setErrorCategory("La catégorie existe déjà.");
      // efface le message après 5s
      setTimeout(() => setErrorCategory(""), 5000);
    } else if (trimmed) {
      setCategories([...categories, trimmed]);
    }
    setNewCategory("");
  };

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = newTask.trim();
    if (trimmed && selected) {
      setTasks([...tasks, { label: trimmed, category: selected, done: false }]);
    }
    setNewTask("");
  };

  const filteredTasks =
    filterCategory === ""
      ? tasks
      : tasks.filter((t) => t.category === filterCategory);

  return (
    <section className="toDo">
      <h1 id="title"> Ma To-Do List par Catégories</h1>

      <form className="inline-input" onSubmit={handleAddCategory}>
        <input
          type="text"
          name="newCategory"
          id="newCategory"
          placeholder="Nouvelle catégorie"
          value={newCategory}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
          required
        />
        <span id="errorCategory">{errorCategory}</span>
        <button type="submit">Ajouter catégorie</button>
      </form>

      <div className="inline-input">
        <select
          className="listCategorie"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value)}
          value={filterCategory}
        >
          <option value="">Toutes les catégories</option>
          <CategoriesOptions categories={categories} />
        </select>
      </div>

      <form className="inline-input" onSubmit={handleAddTask}>
        <input
          type="text"
          name="newTask"
          id="newTask"
          placeholder="Nouvelle tâche"
          value={newTask}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          required
        />
        <select
          className="listCategorie"
          value={selected}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelected(e.target.value)}
          required
        >
          <option value="" disabled>
            -- Choisissez une catégorie --
          </option>
          <CategoriesOptions categories={categories} />
        </select>
        <button type="submit">Ajouter</button>
      </form>
      <TaskList tasks={filteredTasks} setTasks={setTasks} />
    </section>
  );
}

export default ToDo;
