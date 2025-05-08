import { Publisher } from './base-publisher';
import { ProductCreatedEvent } from './product-created-event';
import { Subjects } from './subjects';

// This test ProductCreatedPublisher is a publisher for the ProductCreatedEvent
// It extends the base Publisher class and specifies the subject it publishes to
export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  readonly subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
