const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    category: { type: String, required: true }, // e-waste, plastic, metal, etc.
    hazardLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    classificationResults: {
        type: String,
        required: true
    },
    recommendations: [String],
    // Enhanced AI-powered analysis fields
    hazardousMaterials: [String],
    environmentalImpact: String,
    safetyPrecautions: [String],
    recyclingSteps: [String],
    componentBreakdown: String,
    disposalWarnings: [String],
    estimatedValue: String,
    carbonFootprint: String,
    imageUrl: String,
    status: { type: String, enum: ['detected', 'recycled', 'disposed'], default: 'detected' },
    detailedData: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', DeviceSchema);
