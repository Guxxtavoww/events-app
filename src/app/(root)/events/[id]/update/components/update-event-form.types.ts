import { z } from 'zod';

import { getEventById } from '@/lib/server-actions/event.actions';

export interface iUpdateEventFormProps {
  event: Required<NonNullable<Awaited<ReturnType<typeof getEventById>>>>;
}

export const updateEventFormSchema = z
  .object({
    title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
    description: z
      .string()
      .min(3, 'Descrição deve ter pelo menos 3 caracteres')
      .max(400, 'Descrição deve ter menos de 400 caracteres'),
    location: z
      .string()
      .min(3, 'Localização deve ter ao menos 3 caracteres')
      .max(400, 'Location deve ter menos de 400 caracteres'),
    image_url: z.string({ required_error: 'Foto é obrigatória' }),
    start_date_time: z.date({ required_error: 'Obrigatório' }),
    end_date_time: z.date({ required_error: 'Obrigatório' }),
    category_id: z
      .string({ required_error: 'Categoria é obrigatória' })
      .transform((value) => +value),
    price: z.string().optional(),
    is_free: z.boolean().optional().default(false),
    url: z.string({ required_error: 'Obrigatório' }).url('Url inválida'),
  })
  .refine(
    (data) => {
      if (!data.is_free) {
        return false;
      }

      return true;
    },
    {
      message: 'Preço é obrigatório caso o evento não irá ser grátis',
      path: ['price'],
    }
  );

export type EventFormType = z.infer<typeof updateEventFormSchema>;
