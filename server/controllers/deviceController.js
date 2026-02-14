const Device = require('../models/Device');
const Hazard = require('../models/Hazard');

exports.classifyDevice = async (req, res) => {
    try {
        const { name, category, imageUrl } = req.body;

        // Mock classification logic
        let hazardLevel = 'Low';
        let recommendations = ['Recycle at E-waste center'];
        let classificationResults = `Detected ${name} as ${category}.`;

        if (category.toLowerCase().includes('battery') || name.toLowerCase().includes('phone')) {
            hazardLevel = 'High';
            recommendations.push('Handle with care, contains lithium-ion');
        }

        const device = new Device({
            userId: req.user.id,
            name,
            category,
            hazardLevel,
            classificationResults,
            recommendations,
            imageUrl
        });

        await device.save();
        res.status(201).json(device);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const total = await Device.countDocuments({ userId: req.user.id });
        const highHazard = await Device.countDocuments({ userId: req.user.id, hazardLevel: 'High' });

        res.json({
            totalDevices: total,
            highHazardDevices: highHazard,
            co2Saved: total * 2.5 // Mock calculation: 2.5kg per device
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
