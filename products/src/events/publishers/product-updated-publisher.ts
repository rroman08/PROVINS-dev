import { Publisher, Subjects, ProductUpdatedEvent } from '@provins/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
