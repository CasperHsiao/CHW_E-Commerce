import { MongoClient } from 'mongodb'
import { Operator, Customer, Product } from './data'

// Connection URL
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

const operators: Operator[] = [
  {
    _id: "jim",
    name: "Jim",
  },
  {
    _id: "mary",
    name: "Mary",
  },
]

const customers: Customer[] = [
  {
    _id: "alice",
    name: "Alice",
  },
  {
    _id: "bob",
    name: "Bob",
  },
]

const inventory: Product[] = [
  {
    name: "Boba",
    price: 0.5,
    description: "A brown tapioca.",
    rating: 5.0
  },{
    name: "Ancheer Bicycle",
    price: 85,
    description: "A premium electrical bicycle.",
    rating: 3.7
  },{
    name: "Deer Park Water",
    price: 2.5,
    description: "A one gallon spring water.",
    rating: 4.7
  },{
    name: "Duke Umbrella",
    price: 35,
    description: "A blue and white umbrella with Duke logo.",
    rating: 2.5
  },{
    name: "A4 Paper",
    price: 5,
    description: "A pack of one hundred pieces of white A4 paper",
    rating: 1.0
  },
]

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("test")

  // set up unique index for upsert -- to make sure a customer cannot have more than one draft order
  db.collection("orders").createIndex(
    { customerId: 1 }, 
    { unique: true, partialFilterExpression: { state: "cart" } }
  )

  // add data
  // console.log("inserting customers", await db.collection("customers").insertMany(customers as any))
  console.log("inserting operators", await db.collection("operators").insertMany(operators as any))
  console.log("inserting products", await db.collection("inventory").insertMany(inventory as any))

  process.exit(0)
}

main()
