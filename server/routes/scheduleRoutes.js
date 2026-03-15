/**
 * Schedule API Endpoints
 */
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.getAllSchedules);
router.post('/', scheduleController.createSchedule);
router.get('/:id', scheduleController.getScheduleById);
router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);
router.get('/bus/:busId', scheduleController.getBusSchedule);

module.exports = router;
