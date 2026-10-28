import { useState, type FormEvent } from "react";
import type { Category } from "../models/categories";

interface AddTaskFormProps {
    categories: Category[];
    loading: boolean;
    onSubmit: (description: string, categoryId: number) => void;
}

function AddTaskForm({ categories, loading, onSubmit }: AddTaskFormProps) {
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState(0);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!description.trim() || categoryId === 0) return;
        onSubmit(description.trim(), categoryId);
        setDescription("");
    };

    return (
        <form className="inline-input" onSubmit={handleSubmit}>
            <input
                type="text"
                name="newTask"
                id="newTask"
                placeholder="Nouvelle tâche"
                aria-label="Nouvelle tâche"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
            />
            <select
                className="listCategorie"
                aria-label="Catégorie de la tâche"
                value={categoryId}
                onChange={(event) => setCategoryId(Number(event.target.value))}
                required
            >
                <option value={0} disabled>-- Choisissez une catégorie --</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <button type="submit" disabled={!description.trim() || categoryId === 0 || loading}>Ajouter</button>
        </form>
    );
}

export default AddTaskForm;