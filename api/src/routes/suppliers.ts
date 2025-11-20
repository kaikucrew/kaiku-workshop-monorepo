import { Router, Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/SupplierService.js';

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

  return router;
}
