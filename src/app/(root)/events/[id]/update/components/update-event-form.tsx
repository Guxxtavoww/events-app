'use client';

import { iUpdateEventFormProps } from './update-event-from.types';

export default function UpdateEventForm({ event }: iUpdateEventFormProps) {
  return (
    <>
      <pre>{JSON.stringify(event, null, 2)}</pre>
    </>
  );
}
