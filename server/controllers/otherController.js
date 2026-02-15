const RecyclingCenter = require('../models/RecyclingCenter');
const Hazard = require('../models/Hazard');

// Center Controllers
exports.getCenters = async (req, res) => {
    try {
        let centers = await RecyclingCenter.find();

        // Seeding data if empty
        if (centers.length === 0) {
            const seedCenters = [
                {
                    name: "E-Waste Recyclers India - Bengaluru",
                    location: "Peenya Industrial Area, Bengaluru",
                    coordinates: { lat: 13.0285, lng: 77.5197 },
                    contact: "+91 80 2839 0000",
                    types: ["Electronics", "Batteries", "Monitors"]
                },
                {
                    name: "Saahas Zero Waste",
                    location: "Koramangala, Bengaluru",
                    coordinates: { lat: 12.9352, lng: 77.6245 },
                    contact: "+91 80 4168 9389",
                    types: ["Plastic", "Metal", "E-waste"]
                },
                {
                    name: "Enviroserve E-Waste Recycling",
                    location: "Whitefield, Bengaluru",
                    coordinates: { lat: 12.9698, lng: 77.7500 },
                    contact: "+91 98800 12345",
                    types: ["IT Assets", "Server Scraps", "Smartphones"]
                },
                {
                    name: "Hulladek Recycling",
                    location: "Indiranagar, Bengaluru",
                    coordinates: { lat: 12.9716, lng: 77.6412 },
                    contact: "+91 80 4090 1234",
                    types: ["Home Appliances", "Mobile Phones", "Batteries"]
                }
            ];
            await RecyclingCenter.insertMany(seedCenters);
            centers = await RecyclingCenter.find();
        }

        res.json(centers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCenter = async (req, res) => {
    try {
        const center = new RecyclingCenter(req.body);
        await center.save();
        res.status(201).json(center);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Hazard Controllers
exports.getHazards = async (req, res) => {
    try {
        const hazards = await Hazard.find();
        res.json(hazards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createHazard = async (req, res) => {
    try {
        const hazard = new Hazard(req.body);
        await hazard.save();
        res.status(201).json(hazard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
