// Create tables:
// challenges
// guesses
// invites
// locations

import 'reflect-metadata'
import express from 'express'

// Initialize database connection
import './src/database'
import routes from './src/routes'
import ExpressUtils from './src/shared/ExpressUtils'

import cors from 'cors'

// Initialize server
const server = express()

// Enable cors
server.use(cors({  }))

// Enable json body parsing
server.use(express.json())

// Enable cookie parsing
server.use(ExpressUtils.cookieParser)

// Use error handler
server.use(ExpressUtils.httpErrorHandler)

// API routes
server.use('/api', routes)


// Startup server
server.listen(process.env.PORT || 3000, () => {
    console.log(`Server online - port ${process.env.PORT || 3000}`)
})

process.on('SIGINT', async () => {
    console.log("Shutting down server with command SIGINT (Ctrl-C)")
    process.exit()
})