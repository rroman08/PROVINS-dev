import { Subjects, Publisher, ExpirationCompleteEvent } from '@provins/common';

// ExpirationCompletePublisher is a publisher that publishes expiration:complete event
// It extends the Publisher base class from @provins/common
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
