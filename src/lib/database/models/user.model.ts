import { Schema, model, models } from 'mongoose';

export const UserSchema = new Schema({
  clerk_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  photo_url: {
    type: String,
    required: true,
  },
});

const User = models.User || model('User', UserSchema);

export default User;
