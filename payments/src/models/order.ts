import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@provins/common';

// This is the order model for the payments service
// It is a "replica" of the order model in the orders service
// Hence, versioning is implemented to handle concurrency issues

interface OrderAttrs {
  id: string;
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  userId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // Versioning is used to handle concurrency issues (done automatically by mongoose)
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

orderSchema.set('versionKey', 'version');   // change __v to version
orderSchema.plugin(updateIfCurrentPlugin);  // wire up the plugin

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    status: attrs.status,
    userId: attrs.userId,
    price: attrs.price,
    version: attrs.version,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
