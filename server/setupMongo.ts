import { MongoClient, ObjectId } from 'mongodb'
import { Operator, Customer, Ingredient } from './data'

// Connection URL
const url = 'mongodb://localhost:27017'
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

const possibleIngredients: Ingredient[] = [
  {
    _id: "A",
    name: "boba",
    price: 0.5,
  },
  {
    _id: "B",
    name: "strawberry",
    price: 1,
  },
  {
    _id: "C",
    name: "cat",
    price: 5,
  },
]

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("test")

  // set up unique index for upsert -- to make sure a customer cannot have more than one draft order
  db.collection("orders").createIndex(
    { customerId: 1 }, 
    { unique: true, partialFilterExpression: { state: "draft" } }
  )

  // add data
  console.log("inserting customers", await db.collection("customers").insertMany(customers as any))
  console.log("inserting operators", await db.collection("operators").insertMany(operators as any))
  console.log("inserting possible ingredients", await db.collection("possibleIngredients").insertMany(possibleIngredients as any))

  process.exit(0)
}

main()
