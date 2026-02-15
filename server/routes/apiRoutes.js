const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { classifyDevice, getDevices, getStats } = require('../controllers/deviceController');
const { getCenters, createCenter, getHazards, createHazard } = require('../controllers/otherController');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '..', 'uploads'));
	},
	filename: (req, file, cb) => {
		const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
		cb(null, `${Date.now()}-${safeName}`);
	}
});

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (!file.mimetype.startsWith('image/')) {
			return cb(new Error('Only image uploads are allowed'));
		}
		cb(null, true);
	}
});

// Device Routes
router.post('/devices/classify', auth, upload.single('image'), classifyDevice);
router.get('/devices', auth, getDevices);
router.get('/devices/stats', auth, getStats);

// Center Routes
router.get('/centers', getCenters);
router.post('/centers', createCenter); // Admin should protect this in production

// Hazard Routes
router.get('/hazards', getHazards);
router.post('/hazards', createHazard);

module.exports = router;
