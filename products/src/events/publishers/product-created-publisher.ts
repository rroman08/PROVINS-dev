import { Publisher, Subjects, ProductCreatedEvent } from '@provins/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
