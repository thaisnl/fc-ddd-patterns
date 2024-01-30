import { AgreggateRoot } from "../../@shared/domain/aggregate-root";
import CustomerAddressChanged from "../event/customer-address-changed.event";
import CustomerCreated from "../event/customer-created.event";
import Address from "../value-object/address";

export default class Customer extends AgreggateRoot {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    super()
    this._id = id;
    this._name = name;
    this.validate();

  }

  static create(id: string, name: string) {
    const customer = new Customer(id, name);
    customer.addEvent(new CustomerCreated({name: name}));

    return customer
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;
    this.addEvent(new CustomerAddressChanged({
      id: this.id,
      name: this.name,
      address: address
    }));
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
