import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChanged from "../customer-address-changed.event";

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerAddressChanged>
{
  handle(event: CustomerAddressChanged): void {
    console.log(`Endereço do cliente: ${event.event_data.id}, ${event.event_data.name} alterado para: ${event.event_data.address}.`); 
  }
}
