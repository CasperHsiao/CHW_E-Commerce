export interface Ingredient {
  _id: string
  name: string
  price: number
}

export interface DraftOrder {
  customerId: string
  ingredientIds: string[]
}

export interface Order extends DraftOrder {
  _id: string
  state: "draft" | "queued" | "blending" | "done"
  operatorId?: string
}

export interface Customer {
  _id: string
  name: string
}

export interface CustomerWithOrders extends Customer {
  orders: Order[]
}

export interface Operator {
  _id: string
  name: string
}

export interface Product {
  name: string
  price: number
  description: string
  rating: number
}

export interface Cart {
  customerId: string
  productIds: string[]
}