import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async() => {

    const orderId = "Id Pedido 1"
    const customerId = "Id Cliente 1"
    const productId1 = "Id Produto 1"
    const productId2 = "Id Produto 2"

    const customerRepository = new CustomerRepository();
    const customer = new Customer(customerId, "Cliente");
    const address = new Address("Rua", 1, "CEP", "Cidade");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(productId1, "Produto 1", 10);
    await productRepository.create(product);
    const product2 = new Product(productId2, "Produto 2", 10);
    await productRepository.create(product2);

    const orderItemId1 = "Id Item do Pedido 1"
    const orderItemId2 = "Id Item do Pedido 2"

    const orderItem = new OrderItem(
      orderItemId1,
      product.name,
      product.price,
      product.id,
      2
    );

    const orderItem2 = new OrderItem(
      orderItemId2,
      product2.name,
      product2.price,
      product2.id,
      1
    )

    const order = new Order(orderId, customerId, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    let savedOrder = await orderRepository.find(orderId);

    expect(savedOrder.items).toHaveLength(1)
    expect(savedOrder.items).toContainEqual(orderItem)


    order.removeItems()
    order.addItem(orderItem2)

    expect(order.items).toHaveLength(1)
    expect(order.items).toContainEqual(orderItem2)

    await orderRepository.update(
      order
    )

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: [
        { 
          model: OrderItemModel
        }
      ],
    });

    await orderModel.reload()

    expect(orderModel.items).toHaveLength(1)

    expect(orderModel.toJSON()).toStrictEqual({
      id: orderId,
      customer_id: customerId,
      total: order.total(),
      items: [
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: orderId,
          product_id: productId2,
        },
      ],
    });
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find("lalala");
    }).rejects.toThrow("Order not found");
  });

  it("should find an order", async () => {
    const orderId = "Id Pedido"
    const customerId = "Id Cliente"
    const productId = "Id Produto"

    const customerRepository = new CustomerRepository();
    const customer = new Customer(customerId, "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(productId, "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order(orderId,customerId, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const result = await orderRepository.find(
      orderId
    )


    expect(result).toStrictEqual(order);
  });

  it("should find all orders", async () => {
    const firstOrderId = "Id Pedido"
    const secondOrderId = "Id Pedido 2"
    const customerId = "Id Cliente"
    const productId = "Id Produto"

    const customerRepository = new CustomerRepository();
    const customer = new Customer(customerId, "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(productId, "Product 1", 10);

    await productRepository.create(product);

    const firstOrderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const secondOrderItem = new OrderItem(
      "2",
      product.name,
      product.price,
      product.id,
      3
    );

    const order = new Order(firstOrderId,customerId, [firstOrderItem]);
    const secondOrder = new Order(secondOrderId, customerId, [secondOrderItem])

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    await orderRepository.create(secondOrder);

    const result = await orderRepository.findAll()


    expect(result).toHaveLength(2)
    expect(result).toContainEqual(order)
    expect(result).toContainEqual(secondOrder)

  });

});
