export interface Ingredient {
  _id: string
  name: string
  price: number
}

// export interface DraftOrder {
//   customerId: string
//   ingredientIds: string[]
// }

export interface Order extends Cart {
  _id: string
  state: "cart" | "processing" | "delivering" | "done"
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