import { Publisher, OrderCreatedEvent, Subjects } from '@provins/common';

// This class is responsible for publishing order:created events
// It extends the Publisher class and sets the subject to OrderCreated
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
