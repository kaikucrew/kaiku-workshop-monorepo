import { Router, Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/SupplierService.js';
import { CreateSupplierSchema } from '../types.js';
import { validateRequest } from '../middleware/validation.js';

export function createSupplierRouter(supplierService: SupplierService): Router {
  const router = Router();

  // GET /api/suppliers - List all suppliers
  router.get('/suppliers', (req: Request, res: Response, next: NextFunction) => {
    try {
      const suppliers = supplierService.getAllSuppliers();
      res.status(200).json(suppliers);
    } catch (error) {
      next(error);
    }
  });

  // POST /api/suppliers - Create new supplier
  router.post(
    '/suppliers',
    validateRequest(CreateSupplierSchema),
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const supplier = supplierService.createSupplier(req.body);
        res.status(201).json(supplier);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
