import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const newUser = await import('@/lib/server-actions/user.actions').then(
      ({ createUser }) => {
        return createUser({
          clerk_id: id,
          email: email_addresses[0].email_address,
          username: username || '',
          first_name,
          last_name,
          photo_url: image_url,
        });
      }
    );

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          user_id: newUser.user_id,
        },
      });
    }

    return NextResponse.json({ message: 'OK', user: newUser });
  }

  if (eventType === 'user.updated') {
    const {
      id,
      image_url: photo_url,
      first_name,
      last_name,
      username,
    } = evt.data;

    const updatedUser = await import('@/lib/server-actions/user.actions').then(
      ({ updateUser }) => {
        return updateUser(id, {
          first_name,
          last_name,
          username: username!,
          photo_url,
        });
      }
    );

    return NextResponse.json({ message: 'OK', user: updatedUser });
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    const deletedUser = await import('@/lib/server-actions/user.actions').then(
      ({ deleteUser }) => {
        return deleteUser(id!);
      }
    );

    return NextResponse.json({ message: 'OK', user: deletedUser });
  }

  return new Response('', { status: 200 });
}
