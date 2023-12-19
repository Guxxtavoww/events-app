'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { zodResolver } from '@hookform/resolvers/zod';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { useUploadThing } from '@/lib/uploadthing.lib';
import { UpdateEventParams } from '@/lib/server-actions/types';
import { updateEvent } from '@/lib/server-actions/event.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '@/components/shared/file-uploader';
import { Textarea } from '@/components/ui/textarea';
import Dropdown from '@/components/shared/dropdown';

import {
  EventFormType,
  iUpdateEventFormProps,
  updateEventFormSchema,
} from './update-event-form.types';

export default function UpdateEventForm({ event }: iUpdateEventFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { userId } = useAuth();
  const { startUpload } = useUploadThing('imageUploader');

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['update-event'],
    mutationFn: (data: UpdateEventParams) => updateEvent(data),
  });

  const form = useForm<EventFormType>({
    resolver: zodResolver(updateEventFormSchema),
    defaultValues: {
      category_id: event.category.category_id,
      description: event.description,
      end_date_time: new Date(event.end_date_time),
      image_url: event.image_url,
      is_free: event.is_free,
      location: event.location,
      price: event.price || undefined,
      start_date_time: new Date(event.start_date_time),
      title: event.title,
      url: event.url,
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isFree, setIsFree] = useState(form.getValues('is_free') === true);

  const onSubmit = useCallback(
    async (data: EventFormType) => {
      try {
        let uploadedImageUrl = data.image_url;

        if (files.length > 0) {
          const uploadedImages = await startUpload(files);

          if (!uploadedImages) throw new Error('Falha ao enviar a foto');

          uploadedImageUrl = uploadedImages[0].url;
        }

        const updatedEvent = await mutateAsync({
          event: {
            ...data,
            image_url: uploadedImageUrl,
            event_id: event.event_id,
          },
          user_id: userId!,
          path: pathname,
        });

        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent.event_id}`);
          setFiles([]);
        }
      } catch (error: any) {
        toast({
          title: 'Erro!',
          variant: 'destructive',
          description: (
            <pre className="mt-2 w-[340px] max-w-full rounded-md bg-slate-950 p-4">
              <code className="text-white max-w-full">
                {error.message || JSON.stringify(error, null, 2)}
              </code>
            </pre>
          ),
        });
      }
    },
    [files, startUpload, mutateAsync, router, form, userId, event, pathname]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Título do Evento"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value.toString()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Descrição"
                    {...field}
                    className="textarea rounded-2xl resize-none overflow-y-auto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                    />
                    <Input
                      placeholder="Local do evento"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="start_date_time"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Quando ira começar:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Horário:"
                      dateFormat="dd/MM/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date_time"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Data final:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Horário:"
                      dateFormat="dd/MM/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="dollar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <Input
                      type="number"
                      placeholder="Preço"
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                      disabled={isFree === true}
                    />
                    <FormField
                      control={form.control}
                      name="is_free"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center">
                              <label
                                htmlFor="is_free"
                                className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                              >
                                Bilhete grátis ?
                              </label>
                              <Checkbox
                                onCheckedChange={(checkedState) => {
                                  field.onChange(checkedState);
                                  setIsFree(checkedState === true);
                                  if (checkedState === true) {
                                    form.setValue('price', '');
                                  }
                                }}
                                checked={field.value}
                                id="is_free"
                                className="mr-2 h-5 w-5 border-2 border-primary-500"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="link"
                      width={24}
                      height={24}
                    />
                    <Input
                      placeholder="URL"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? '...' : 'Editar Evento'}
        </Button>
      </form>
    </Form>
  );
}
