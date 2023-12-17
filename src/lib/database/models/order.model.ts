import { Schema, model, models, Document } from 'mongoose';

export interface IOrder extends Document {
  created_at: Date;
  stripe_id: string;
  total_amount: string;
  event: {
    _id: string;
    title: string;
  };
  buyer: {
    _id: string;
    first_name: string;
    last_name: string;
  };
}

export type IOrderItem = {
  _id: string;
  total_amount: string;
  created_at: Date;
  event_title: string;
  event_id: string;
  buyer: string;
};

const OrderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripe_id: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: String,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Order = models.Order || model('Order', OrderSchema);

export default Order;
