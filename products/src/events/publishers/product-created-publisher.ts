import { Publisher, Subjects, ProductCreatedEvent } from '@provins/common';

// This class is responsible for publishing product:created events
// It extends the Publisher class and sets the subject to ProductCreated
export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
