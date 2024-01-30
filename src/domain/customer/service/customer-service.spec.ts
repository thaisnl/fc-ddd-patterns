import { CustomerService } from "./customer-service"
import { mediator } from "../../../index"
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Address from "../value-object/address";
import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";

describe("Customer unit tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([CustomerModel]);
      await sequelize.sync({ force: true });
    });
  
    afterEach(async () => {
      await sequelize.close();
    });
    
    it("should emit events", async () => {
        const logSpy = jest.spyOn(global.console, 'log');

        let repo = new CustomerRepository();

        let service = new CustomerService(
            repo,
            mediator
        )

        const address = new Address("Rua", 5, "1234", "Fortaleza");
        let customer = await service.create("John", address);

        expect(logSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledTimes(3);
        expect(logSpy).toHaveBeenCalledWith('Esse é o primeiro console.log do evento: CustomerCreated');
        expect(logSpy).toHaveBeenCalledWith('Esse é o segundo console.log do evento: CustomerCreated');
        expect(logSpy).toHaveBeenCalledWith('Esse é o segundo console.log do evento: CustomerCreated');
        expect(logSpy).toHaveBeenCalledWith(`Endereço do cliente: ${customer.id}, John alterado para: Rua, 5, 1234 Fortaleza.`);

    });
})