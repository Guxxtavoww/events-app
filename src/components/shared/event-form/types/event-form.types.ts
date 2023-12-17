import { IEvent } from '@/lib/database/models/event.model';
import { z } from 'zod';

export interface iEventFormProps {
  userId: string;
  type: 'Create' | 'Update';
  event?: IEvent;
  eventId?: string;
}

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z
    .string()
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(400, 'Descrição deve ter menos de 400 caracteres'),
  location: z
    .string()
    .min(3, 'Localização deve ter ao menos 3 caracteres')
    .max(400, 'Location deve ter menos de 400 caracteres'),
  image_url: z.string(),
  start_date_time: z.date(),
  end_date_time: z.date(),
  category_id: z.string(),
  price: z.string(),
  is_free: z.boolean(),
  url: z.string().url(),
});

export type EventFormType = z.infer<typeof eventFormSchema>;
