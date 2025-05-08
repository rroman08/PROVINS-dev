import { Publisher, Subjects, ProductUpdatedEvent } from '@provins/common';

// This class is responsible for publishing product:updated events
// It extends the Publisher class and sets the subject to ProductUpdated
export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
