import type { Category } from "./categories";

export interface Task {
    id: number;
    description: string;
    is_completed: boolean;
    created_at: string;
    category: Category;
}
