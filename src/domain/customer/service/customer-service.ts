import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import { Mediator } from "../../@shared/service/mediator";
import Customer from "../entity/customer";
import {v4 as uuid} from 'uuid'
import Address from "../value-object/address";


export class CustomerService{

    constructor(
        private customerRepo: CustomerRepository, 
        private mediator: Mediator,
        ){}

    async create(name: string, address: Address){
        const customer = Customer.create(uuid(), name);
        customer.changeAddress(address);
        await this.customerRepo.create(customer);
        await this.mediator.publish(customer); 
        return customer;
    }
}
