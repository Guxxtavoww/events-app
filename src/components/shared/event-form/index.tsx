'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { zodResolver } from '@hookform/resolvers/zod';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation } from '@tanstack/react-query';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useUploadThing } from '@/lib/uploadthing.lib';
import { eventDefaultValues } from '@/constants';
import {
  CreateEventParams,
  UpdateEventParams,
} from '@/lib/server-actions/types';
import { createEvent, updateEvent } from '@/lib/server-actions/event.actions';

import {
  EventFormType,
  eventFormSchema,
  iEventFormProps,
} from './types/event-form.types';
import Dropdown from '../dropdown';
import { FileUploader } from '../file-uploader';

export default function EventForm({
  type,
  userId,
  event,
  eventId,
}: iEventFormProps) {
  const router = useRouter();

  const { startUpload } = useUploadThing('imageUploader');

  const [files, setFiles] = useState<File[]>([]);

  const initialValues = useMemo(
    () =>
      event && type === 'Update'
        ? {
            ...event,
            startDateTime: new Date(event.start_date_time),
            endDateTime: new Date(event.end_date_time),
          }
        : eventDefaultValues,
    [event, type]
  );

  const form = useForm<EventFormType>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  });

  const { mutateAsync: createEventMutation } = useMutation({
    mutationKey: ['create-event'],
    mutationFn: (data: CreateEventParams) => createEvent(data),
  });

  const { mutateAsync: updateEventMutation } = useMutation({
    mutationKey: ['update-event'],
    mutationFn: (data: UpdateEventParams) => updateEvent(data),
  });

  const onSubmit = useCallback(
    async (data: EventFormType) => {
      let uploadedImageUrl = data.image_url;

      if (files.length > 0) {
        const uploadedImages = await startUpload(files);

        if (!uploadedImages) return;

        uploadedImageUrl = uploadedImages[0].url;
      }

      if (type === 'Create') {
        const newEvent = await createEventMutation({
          event: { ...data, image_url: uploadedImageUrl },
          user_id: userId,
          path: '/profile',
        });

        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
          setFiles([]);
        }

        return;
      }

      if (!eventId) {
        router.back();

        return;
      }

      const updatedEvent = await updateEventMutation({
        user_id: userId,
        event: { ...data, image_url: uploadedImageUrl, _id: eventId },
        path: `/events/${eventId}`,
      });

      if (updatedEvent) {
        form.reset();
        router.push(`/events/${updatedEvent._id}`);
        setFiles([]);
      }
    },
    [
      files,
      startUpload,
      type,
      createEventMutation,
      userId,
      router,
      form,
      eventId,
      updateEventMutation,
    ]
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
                    value={field.value}
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
                      dateFormat="MM/dd/yyyy h:mm aa"
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
                      dateFormat="MM/dd/yyyy h:mm aa"
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
                      {...field}
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Bilhete grátis ?
                              </label>
                              <Checkbox
                                onCheckedChange={field.onChange}
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
          {form.formState.isSubmitting
            ? '...'
            : type === 'Create'
            ? 'Criar Evento'
            : 'Editar Evento'}
        </Button>
      </form>
    </Form>
  );
}
