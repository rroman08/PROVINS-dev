import { Subjects, Publisher, OrderCancelledEvent } from '@provins/common';

// This class is responsible for publishing order:cancelled events
// It extends the Publisher class and sets the subject to OrderCancelled
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
