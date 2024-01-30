import { IDomainEvent } from "../../@shared/domain/domain-event.interface";
import EventInterface from "../../@shared/event/event.interface";

export default class CustomerCreated implements IDomainEvent {
    occurred_on: Date
    event_data: any

  constructor(event_data: any) {
    this.occurred_on = new Date();
    this.event_data = event_data;
  }
}
