import { createServer } from "http"
import { Server } from "socket.io"
// import { Action, createEmptyGame, doAction, filterCardsForPlayerPerspective, Card } from "./model"
import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Issuer, Strategy } from 'openid-client'
import passport from 'passport'
import { keycloak } from "./secrets"
import { Cart, Order } from './data'

if (process.env.PROXY_KEYCLOAK_TO_LOCALHOST) {
  // NOTE: this is a hack to allow Keycloak to run from the 
  // same development machine as the rest of the app. We have exposed
  // Keycloak to run off port 8081 of localhost, where localhost is the
  // localhost of the underlying laptop, but localhost inside of the
  // server's Docker container is just the container, not the laptop.
  // The following line creates a reverse proxy to the Keycloak Docker
  // container so that localhost:8081 can also be used to access Keycloak.
  require("http-proxy").createProxyServer({ target: "http://keycloak:8080" }).listen(8081)
}

// set up Mongo
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(mongoUrl)
let db: Db
let customers: Collection
let orders: Collection
let operators: Collection
let inventory: Collection

// set up Express
const app = express()
const server = createServer(app)
const port = parseInt(process.env.PORT) || 8095
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// set up session
const sessionMiddleware = session({
  secret: 'a just so-so secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },

  // comment out the following to default to a memory-based store, which,
  // of course, will not persist across load balanced servers
  // or survive a restart of the server
  store: MongoStore.create({
    mongoUrl,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
})
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user: any, done: any) => {
  logger.info("serializeUser " + JSON.stringify(user))
  done(null, user)
})
passport.deserializeUser((user: any, done: any) => {
  logger.info("deserializeUser " + JSON.stringify(user))
  done(null, user)
})

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401)
    return
  }

  next()
}

// set up Socket.IO
const io = new Server(server)

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware: any) => (socket: any, next: any) => middleware(socket.request, {}, next)
io.use(wrap(sessionMiddleware))

// hard-coded game configuration
// const playerUserIds = ["dennis", "alice"]
// let gameState = createEmptyGame(playerUserIds, 1, 2)

// function emitUpdatedCardsForPlayers(cards: Card[], newGame = false) {
//   gameState.playerNames.forEach((_, i) => {
//     let updatedCardsFromPlayerPerspective = filterCardsForPlayerPerspective(cards, i)
//     if (newGame) {
//       updatedCardsFromPlayerPerspective = updatedCardsFromPlayerPerspective.filter(card => card.locationType !== "unused")
//     }
//     console.log("emitting update for player", i, ":", updatedCardsFromPlayerPerspective)
//     io.to(String(i)).emit(
//       newGame ? "all-cards" : "updated-cards", 
//       updatedCardsFromPlayerPerspective,
//     )
//   })
// }

// io.on('connection', client => {
//   const user = (client.request as any).session?.passport?.user
//   logger.info("new socket connection for user " + JSON.stringify(user))
//   if (!user) {
//     client.disconnect()
//     return
//   }

//   function emitGameState() {
//     client.emit(
//       "game-state", 
//       playerIndex,
//       gameState.currentTurnPlayerIndex,
//       gameState.phase,
//       gameState.playCount,
//     )
//   }
  
//   console.log("New client")
//   let playerIndex: number | "all" = playerUserIds.indexOf(user.preferred_username)
//   if (playerIndex === -1) {
//     playerIndex = "all"
//   }
//   client.join(String(playerIndex))
  
//   if (typeof playerIndex === "number") {
//     client.emit(
//       "all-cards", 
//       filterCardsForPlayerPerspective(Object.values(gameState.cardsById), playerIndex).filter(card => card.locationType !== "unused"),
//     )
//   } else {
//     client.emit(
//       "all-cards", 
//       Object.values(gameState.cardsById),    
//     )
//   }
//   emitGameState()

//   client.on("action", (action: Action) => {
//     if (typeof playerIndex === "number") {
//       const updatedCards = doAction(gameState, { ...action, playerIndex })
//       emitUpdatedCardsForPlayers(updatedCards)
//     } else {
//       // no actions allowed from "all"
//     }
//     io.to("all").emit(
//       "updated-cards", 
//       Object.values(gameState.cardsById),    
//     )
//     io.emit(
//       "game-state", 
//       null,
//       gameState.currentTurnPlayerIndex,
//       gameState.phase,
//       gameState.playCount,
//     )
//   })

//   client.on("new-game", () => {
//     gameState = createEmptyGame(gameState.playerNames, 1, 2)
//     const updatedCards = Object.values(gameState.cardsById)
//     emitUpdatedCardsForPlayers(updatedCards, true)
//     io.to("all").emit(
//       "all-cards", 
//       updatedCards,
//     )
//     emitGameState()
//   })
// })

// app routes
app.get("/api/inventory", async (req, res) => {
  res.status(200).json(await inventory.find({}).toArray())
})

app.get("/api/orders", async (req, res) => {
  res.status(200).json(await orders.find({ state: { $ne: "cart" }}).toArray())
})

app.get("/api/customer/:customerId", async (req, res) => {
  const _id = req.params.customerId
  const customer = await customers.findOne({ _id })
  if (customer == null) {
    res.status(404).json({ _id })
    return
  }
  customer.orders = await orders.find({ customerId: _id, state: { $ne: "cart" } }).toArray()
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

app.get("/api/customer/:customerId/cart", async (req, res) => {
  const { customerId } = req.params

  // TODO: validate customerId

  const draftOrder = await orders.findOne({ state: "cart", customerId })
  res.status(200).json(draftOrder || { customerId, productIds: [] })
})

app.put("/api/customer/:customerId/update-cart", async (req, res) => {
  const order: Cart = req.body
  // TODO: validate customerId

  const result = await orders.updateOne(
    {
      customerId: req.params.customerId,
      state: "cart",
    },
    {
      $set: {
        productIds: order.productIds
      }
    },
    {
      upsert: true
    }
  )
  res.status(200).json({ status: "ok" })
})

app.post("/api/customer/:customerId/checkout-cart", async (req, res) => {
  const result = await orders.updateOne(
    {
      customerId: req.params.customerId,
      state: "cart",
    },
    {
      $set: {
        state: "processing",
      }
    }
  )
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "no cart found" })
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
    case "delivering":
      condition.state.$in.push("processing")
      // can only go to blending state if no operator assigned (or is the current user, due to idempotency)
      condition.$or = [{ operatorId: { $exists: false }}, { operatorId: order.operatorId }]
      break
    case "done":
      condition.state.$in.push("delivering")
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

app.get(
  "/api/logout", 
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      res.redirect("/init")
    })
  }
)

app.get("/api/user", (req, res) => {
  res.json(req.user || {})
})

// connect to Mongo
client.connect().then(() => {
  console.log('Connected successfully to MongoDB')
  db = client.db("test")
  operators = db.collection('operators')
  orders = db.collection('orders')
  customers = db.collection('customers')
  inventory = db.collection('inventory')

  Issuer.discover("http://127.0.0.1:8081/auth/realms/game/.well-known/openid-configuration").then(issuer => {
    const client = new issuer.Client(keycloak)
  
    passport.use("oidc", new Strategy(
      { 
        client,
        params: {
          // this forces a fresh login screen every time
          prompt: "login"
        }
      },
      async (tokenSet: any, userInfo: any, done: any) => {
        logger.info("oidc " + JSON.stringify(userInfo))

        const _id = userInfo.preferred_username
        const operator = await operators.findOne({ _id })
        if (operator != null) {
          userInfo.roles = ["operator"]
        } else {
          await customers.updateOne(
            { _id },
            {
              $set: {
                name: userInfo.name
              }
            },
            { upsert: true }
          )
          userInfo.roles = ["customer"]
        }

        return done(null, userInfo)
      }
    ))

    app.get(
      "/api/login", 
      passport.authenticate("oidc", { failureRedirect: "/api/login" }), 
      (req, res) => res.redirect("/init")
    )
    
    app.get(
      "/api/login-callback",
      passport.authenticate("oidc", {
        failureRedirect: "/api/login",
      }),
      (req, res) => {
        const _id = req.user.preferred_username

        if (req.user.roles.includes("operator")) {
          res.redirect(`/operator/${_id}`)
        } else {
          res.redirect(`/customer/${_id}`)
        }
      }
    )    

    // start server
    server.listen(port)
    logger.info(`Game server listening on port ${port}`)
  })

  // start server
  // app.listen(port, () => {
  //   console.log(`Server listening on port ${port}`)
  // })
})
