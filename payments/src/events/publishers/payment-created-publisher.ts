import { Publisher, Subjects, PaymentCreatedEvent } from '@provins/common';

// This class is responsible for publishing payment created events
// It extends the Publisher class and sets the subject to PaymentCreated
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
