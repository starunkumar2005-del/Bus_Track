/**
 * Bus API Endpoints
 */
const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

router.get('/', busController.getAllBuses);
router.post('/', busController.createBus);
router.get('/:id', busController.getBusById);
router.put('/:id', busController.updateBus);
router.delete('/:id', busController.deleteBus);
router.get('/:id/location', busController.getBusLocation);
router.post('/:id/assign-route', busController.assignBusToRoute);

module.exports = router;
