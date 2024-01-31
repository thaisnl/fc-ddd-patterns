import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import { Sequelize, Op } from 'sequelize';
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";

export default class OrderRepository implements OrderRepositoryInterface{
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const order = await OrderModel.findOne(
      {
        where: {id: entity.id}, 
        include: [
          { model: OrderItemModel }
        ]
      }
    )

    if (!order) {
      throw Error("Order not found")
    }

    await OrderItemModel.destroy(
      {
        where: {
          order_id: entity.id
        }
      }
    )

    OrderItemModel.bulkCreate(
      entity.items.map(
        (i) => ({
          id: i.id,
          product_id: i.productId,
          order_id: entity.id,
          quantity: i.quantity,
          name: i.name,
          price: i.price
        })
      )
    )

    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: {id: entity.id}
      }
    )
  }
  

  async find(id: string): Promise<Order> {
    let order;

    try {
      order = await OrderModel.findOne(
        {
          where: {
            id: id
          },
          include: [
            { 
              model: OrderItemModel,
              include: [
                {
                  model: ProductModel
                }
              ]
            }
          ],
          rejectOnEmpty: true,
        },
    )
    } catch (error) {
      throw new Error("Order not found");
    }
    
    const mappedOrder: Order = new Order(
      order.id,
      order.customer_id,
      order.items.map(
        (item) => new OrderItem(
          item.id,
          item.product.name,
          item.product.price,
          item.product.id,
          item.quantity
        )
      )
    )

    return mappedOrder;

  }

  async findAll(): Promise<Order[]> {

    const orders = await OrderModel.findAll(
      {
        include: [
          { 
            model: OrderItemModel,
            include: [
              {
                model: ProductModel
              }
            ]
          }
        ],
      }
    )
    
    const mappedOrders: Order[] = orders.map(
      (order) =>
      new Order(
        order.id,
        order.customer_id,
        order.items.map(
          (item) => new OrderItem(
            item.id,
            item.product.name,
            item.product.price,
            item.product.id,
            item.quantity
          )
        )
      )
    )

    return mappedOrders;

  }
}
