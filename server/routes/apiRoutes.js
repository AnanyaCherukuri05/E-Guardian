const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { classifyDevice, getDevices, getStats } = require('../controllers/deviceController');
const { getCenters, createCenter, getHazards, createHazard } = require('../controllers/otherController');

// Device Routes
router.post('/devices/classify', auth, classifyDevice);
router.get('/devices', auth, getDevices);
router.get('/devices/stats', auth, getStats);

// Center Routes
router.get('/centers', getCenters);
router.post('/centers', createCenter); // Admin should protect this in production

// Hazard Routes
router.get('/hazards', getHazards);
router.post('/hazards', createHazard);

module.exports = router;
