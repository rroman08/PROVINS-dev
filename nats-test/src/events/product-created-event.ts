import { Subjects } from './subjects';

// Define the structure of the ProductCreatedEvent
export interface ProductCreatedEvent {
  subject: Subjects.ProductCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
