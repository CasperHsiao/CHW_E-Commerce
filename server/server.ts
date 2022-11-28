import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { DraftOrder, Order } from './data'

// set up Mongo
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)
let db: Db
let customers: Collection
let orders: Collection
let operators: Collection
let possibleIngredients: Collection

// set up Express
const app = express()
const port = parseInt(process.env.PORT) || 8095
app.use(bodyParser.json())

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// app routes
app.get("/api/possible-ingredients", async (req, res) => {
  res.status(200).json(await possibleIngredients.find({}).toArray())
})

app.get("/api/orders", async (req, res) => {
  res.status(200).json(await orders.find({ state: { $ne: "draft" }}).toArray())
})

app.get("/api/customer/:customerId", async (req, res) => {
  const _id = req.params.customerId
  const customer = await customers.findOne({ _id })
  if (customer == null) {
    res.status(404).json({ _id })
    return
  }
  customer.orders = await orders.find({ customerId: _id, state: { $ne: "draft" } }).toArray()
  res.status(200).json(customer)
})

app.get("/api/operator/:operatorId", async (req, res) => {
  const _id = req.params.operatorId
  const operator = await operators.findOne({ _id })
  if (operator == null) {
    res.status(404).json({ _id })
    return
  }
  operator.orders = await orders.find({ operatorId: _id }).toArray()
  res.status(200).json(operator)
})

app.get("/api/customer/:customerId/draft-order", async (req, res) => {
  const { customerId } = req.params

  // TODO: validate customerId

  const draftOrder = await orders.findOne({ state: "draft", customerId })
  res.status(200).json(draftOrder || { customerId, ingredientIds: [] })
})

app.put("/api/customer/:customerId/draft-order", async (req, res) => {
  const order: DraftOrder = req.body
  // TODO: validate customerId

  const result = await orders.updateOne(
    {
      customerId: req.params.customerId,
      state: "draft",
    },
    {
      $set: {
        ingredientIds: order.ingredientIds
      }
    },
    {
      upsert: true
    }
  )
  res.status(200).json({ status: "ok" })
})

app.post("/api/customer/:customerId/submit-draft-order", async (req, res) => {
  const result = await orders.updateOne(
    {
      customerId: req.params.customerId,
      state: "draft",
    },
    {
      $set: {
        state: "queued",
      }
    }
  )
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "no draft order" })
    return
  }
  res.status(200).json({ status: "ok" })
})

app.put("/api/order/:orderId", async (req, res) => {
  const order: Order = req.body

  // TODO: validate order object

  const condition: any = {
    _id: new ObjectId(req.params.orderId),
    state: { 
      $in: [
        // because PUT is idempotent, ok to call PUT twice in a row with the existing state
        order.state
      ]
    },
  }
  switch (order.state) {
    case "blending":
      condition.state.$in.push("queued")
      // can only go to blending state if no operator assigned (or is the current user, due to idempotency)
      condition.$or = [{ operatorId: { $exists: false }}, { operatorId: order.operatorId }]
      break
    case "done":
      condition.state.$in.push("blending")
      condition.operatorId = order.operatorId
      break
    default:
      // invalid state
      res.status(400).json({ error: "invalid state" })
      return
  }
  
  const result = await orders.updateOne(
    condition,
    {
      $set: {
        state: order.state,
        operatorId: order.operatorId,
      }
    }
  )

  if (result.matchedCount === 0) {
    res.status(400).json({ error: "orderId does not exist or state change not allowed" })
    return
  }
  res.status(200).json({ status: "ok" })
})

// connect to Mongo
client.connect().then(() => {
  console.log('Connected successfully to MongoDB')
  db = client.db("test")
  operators = db.collection('operators')
  orders = db.collection('orders')
  customers = db.collection('customers')
  possibleIngredients = db.collection('possibleIngredients')

  // start server
  app.listen(port, () => {
    console.log(`Smoothie server listening on port ${port}`)
  })
})
