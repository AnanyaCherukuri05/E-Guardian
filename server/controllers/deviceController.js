const Device = require('../models/Device');
const Hazard = require('../models/Hazard');
const { analyzeDevice } = require('../services/aiService');

exports.classifyDevice = async (req, res) => {
    try {
        const { name, category, imageUrl } = req.body;
        const uploadedImageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Use AI service for comprehensive device analysis
        console.log(`Analyzing device: ${name} (${category})`);
        const analysis = await analyzeDevice(name, category);

        const classificationResults = `AI-Powered Analysis: ${name} identified as ${category}. ${analysis.environmentalImpact.substring(0, 150)}...`;

        const device = new Device({
            userId: req.user.id,
            name,
            category,
            hazardLevel: analysis.hazardLevel,
            classificationResults,
            recommendations: analysis.recyclingSteps.slice(0, 3), // Keep top 3 for backward compatibility
            // Enhanced AI analysis data
            hazardousMaterials: analysis.hazardousMaterials,
            environmentalImpact: analysis.environmentalImpact,
            safetyPrecautions: analysis.safetyPrecautions,
            recyclingSteps: analysis.recyclingSteps,
            componentBreakdown: analysis.componentBreakdown,
            disposalWarnings: analysis.disposalWarnings,
            estimatedValue: analysis.estimatedValue,
            carbonFootprint: analysis.carbonFootprint,
            imageUrl: uploadedImageUrl || imageUrl
        });

        await device.save();
        res.status(201).json(device);
    } catch (err) {
        console.error('Device classification error:', err);
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
