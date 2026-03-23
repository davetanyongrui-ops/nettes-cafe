import { z } from 'zod';

export const menuItemSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    description: z.string().optional(),
    category: z.enum(['soup', 'muffin', 'pie', 'wrap', 'special', 'pastry', 'salad_base', 'salad_protein', 'salad_dressing', 'salad_topping', 'coffee', 'tea', 'milkshakes', 'other_drinks', 'build_bowl', 'build_wrap']),
    price: z.number().min(0, 'Price must be 0 or greater'),
    is_sold_out: z.boolean(),
    image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;
