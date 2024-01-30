import { Mediator } from "./domain/@shared/service/mediator"
import CustomerAddressChanged from "./domain/customer/event/customer-address-changed.event";
import CustomerCreated from "./domain/customer/event/customer-created.event";
import EnviaConsoleLog1Handler from "./domain/customer/event/handler/send-console-log-1-when-customer-created.handler";
import EnviaConsoleLog2Handler from "./domain/customer/event/handler/send-console-log-2-when-customer-created.handler";
import EnviaConsoleLogHandler from "./domain/customer/event/handler/send-console-log-when-address-changed";

export const mediator = new Mediator();


const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
const enviaConsoleLogHandler = new EnviaConsoleLogHandler();


mediator.register(CustomerCreated.name, (event: CustomerCreated) => {
    enviaConsoleLog1Handler.handle(event);
    enviaConsoleLog2Handler.handle(event);
})

mediator.register(CustomerAddressChanged.name, (event: CustomerAddressChanged) => {
    enviaConsoleLogHandler.handle(event);
})