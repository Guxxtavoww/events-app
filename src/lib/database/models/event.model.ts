import { Document, Schema, model, models } from 'mongoose';

export interface IEvent extends Document {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  created_at: Date;
  image_url: string;
  start_date_time: Date;
  end_date_time: Date;
  price: string;
  is_free: boolean;
  url?: string;
  category: { _id: string; name: string };
  organizer: { _id: string; first_name: string; last_name: string };
}

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  created_at: { type: Date, default: Date.now },
  image_url: { type: String, required: true },
  start_date_time: { type: Date, default: Date.now },
  end_date_time: { type: Date, default: Date.now },
  price: { type: String },
  is_free: { type: Boolean, default: false },
  url: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Event = models.Event || model('Event', EventSchema);

export default Event;
