import { IDomainEvent } from '../domain/domain-event.interface';
import EventInterface from './event.interface';
export default interface EventHandlerInterface<T extends IDomainEvent=IDomainEvent> {
    handle(event: T): void;
}