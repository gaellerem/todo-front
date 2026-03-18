import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getCategories, createCategory, getTasks, createTask, deleteTask, updateTask } from "../api/client";
import type { Category } from "../models/categories";
import type { Task } from "../models/tasks";
import TaskList from "./TaskList";

function ToDo() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

	const [newCategory, setNewCategory] = useState<string>("");
	const [newTask, setNewTask] = useState<string>("");

	const [filterCategory, setFilterCategory] = useState<number>(0);
	const [selected, setSelected] = useState<number>(0);

    const withLoading = async (fn: () => Promise<void>) => {
        document.body.style.cursor = "wait";
        setLoading(true);
        try {
            await fn();
        } finally {
            setLoading(false);
            document.body.style.cursor = "default";
        }
    };

    const refetchAll = () => 
        withLoading(async () => {
            try {
                const [fetchedCategories, fetchedTasks] = await Promise.all([
                    getCategories(),
                    getTasks()
                ]);

                setCategories(fetchedCategories);
                setTasks(fetchedTasks);
            } catch (err: any) {
                if (err.type === "network") {
                    toast.error(err.message);
                }
                console.log(err.message || "Impossible de charger les données.");
            }
        });

    useEffect(() => {
        refetchAll();
    }, []);

    const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => 
        withLoading(async () => {
            e.preventDefault();
            const trimmed = newCategory.trim();
            if (!trimmed) return;

            try {
                const created = await createCategory(trimmed);
                setCategories([...categories, created]);
                setNewCategory("");
            } catch (err: any) {
                if (err.type === "validation" && err.errors?.name) {
                    // Affiche le message spécifique de validation
                    toast.error(err.errors.name.join(", "));
                    console.log("Erreur de validation :", err.errors.name.join(", "));
                    return;
                }
                if (err.type === "not_found") {
                    await refetchAll();
                    console.log("Ressource non trouvée, données rafraîchies.");
                    return;
                }
                console.log(err.message || "Impossible de créer la catégorie.");
            }
	    });

	const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => 
        withLoading(async () => {
            e.preventDefault();
            if (!newTask.trim() || selected === 0) return;

            try {
                const created = await createTask({
                    description: newTask.trim(),
                    category_id: selected,
                });
                setTasks(prev => [...prev, created]);
                setNewTask("");
            } catch (err: any) {
                if (err.type === "validation" && err.errors?.category_id) {
                    // Affiche le message spécifique de validation
                    toast.error(err.errors.category_id.join(", "));
                    console.log("Erreur de validation :", err.errors.category_id.join(", "));
                    return;
                }
                console.log(err.message || "Impossible de créer la catégorie.");
            } 
	    });

    const handleToggleTask = (taskId: number, current: boolean) =>
        withLoading(async () => {
            try {
                const updated = await updateTask(taskId, { is_completed: !current });
                setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
            } catch (err: any) {
                if (err.type === "not_found") {
                    await refetchAll();
                    return;
                }
                console.log(err.message);
            }
        });

    const handleDeleteTask = (taskId: number) =>
        withLoading (async () => {
            try {
                await deleteTask(taskId);
                setTasks(prev => prev.filter(t => t.id !== taskId));
            } catch (err: any) {
                if (err.type === "not_found") {
                    await refetchAll();
                    return;
                }
                console.log(err.message);
            }
        });

	const filteredTasks =
		filterCategory === 0 ? tasks : tasks.filter((t) => t.category.id === filterCategory);

	return (
		<section className={`flex flex-col p-5 gap-4 ${loading ? "app-loading" : ""}`}>
			<h1 id="title" className="text-center text-2xl font-bold"> Ma To-Do List par Catégories</h1>

            <form className="inline-input" onSubmit={handleAddCategory}>
                <input
                    type="text"
                    name="newCategory"
                    id="newCategory"
                    placeholder="Nouvelle catégorie"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                />
                <button type="submit" disabled={!newCategory.trim() || loading}>Ajouter catégorie</button>
            </form>

            <div className="inline-input">
                <select
                    className="listCategorie"
                    onChange={(e) => setFilterCategory(Number(e.target.value))}
                    value={filterCategory}
                >
                <option value={0}>Toutes les catégories</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
                </select>
            </div>

            <form className="inline-input" onSubmit={handleAddTask}>
                <input
                    type="text"
                    name="newTask"
                    id="newTask"
                    placeholder="Nouvelle tâche"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    required
                />
                <select
                    className="listCategorie"
                    value={selected}
                    onChange={(e) => setSelected(Number(e.target.value))}
                    required
                >
                    <option value={0} disabled>
                        -- Choisissez une catégorie --
                    </option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button type="submit" disabled={!newTask.trim() || selected === 0 || loading}>Ajouter</button>
            </form>
            <TaskList 
                tasks={filteredTasks}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
            />
		</section>
	);
}

export default ToDo;
