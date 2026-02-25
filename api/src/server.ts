import express, { Request, Response } from 'express'
import cors from 'cors'
import { errorHandler, authMiddleware } from './middleware/index.js'
import { OfferRepository } from './repositories/OfferRepository.js'
import { SupplierRepository } from './repositories/SupplierRepository.js'
import { OfferService } from './services/OfferService.js'
import { SupplierService } from './services/SupplierService.js'
import { createOfferRouter } from './routes/offers.js'
import { createSupplierRouter } from './routes/suppliers.js'

const app = express()
const PORT = process.env.PORT || 3001

// Initialize repositories
const supplierRepository = new SupplierRepository()
const supplierIds = supplierRepository.getSupplierIds()
const offerRepository = new OfferRepository(supplierIds)

// Initialize services
const offerService = new OfferService(offerRepository, supplierRepository)
const supplierService = new SupplierService(supplierRepository)

// Configure middleware
app.use(cors())
app.use(express.json())

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/', (_req: Request, res: Response) => {
  const version = process.env.API_VERSION || 'local'
  res.status(200).json({ version })
})

// Register API routes
app.use('/api', authMiddleware)
app.use('/api', createOfferRouter(offerService))
app.use('/api', createSupplierRouter(supplierService))

// Error handling middleware (must be last)
app.use(errorHandler)

// Only start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log('='.repeat(50))
    console.log('🚀 CRUD API Server Started')
    console.log('='.repeat(50))
    console.log(`📍 Server URL: http://localhost:${PORT}`)
    console.log(`📊 Health Check: http://localhost:${PORT}/health`)
    console.log(`📦 API Endpoints:`)
    console.log(`   - GET    /api/offers`)
    console.log(`   - POST   /api/offers`)
    console.log(`   - GET    /api/offer/:id`)
    console.log(`   - PUT    /api/offer/:id`)
    console.log(`   - DELETE /api/offer/:id`)
    console.log(`   - GET    /api/suppliers`)
    console.log('='.repeat(50))
  })
}

export { app }
