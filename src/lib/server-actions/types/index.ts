export interface iCreateUserPayload {
  clerk_id: string;
  email: string;
  username: string | null;
  first_name: string;
  last_name: string;
  photo_url: string;
}

export type UpdateUserParams = {
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
};
