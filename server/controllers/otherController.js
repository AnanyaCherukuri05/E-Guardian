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
                    address: "Peenya Industrial Area, Bengaluru",
                    location: {
                        type: "Point",
                        coordinates: [77.5197, 13.0285] // [lng, lat]
                    },
                    contact: "+91 80 2839 0000",
                    acceptedWaste: ["Electronics", "Batteries", "Monitors"]
                },
                {
                    name: "Saahas Zero Waste",
                    address: "Koramangala, Bengaluru",
                    location: {
                        type: "Point",
                        coordinates: [77.6245, 12.9352]
                    },
                    contact: "+91 80 4168 9389",
                    acceptedWaste: ["Plastic", "Metal", "E-waste"]
                },
                {
                    name: "Enviroserve E-Waste Recycling",
                    address: "Whitefield, Bengaluru",
                    location: {
                        type: "Point",
                        coordinates: [77.7500, 12.9698]
                    },
                    contact: "+91 98800 12345",
                    acceptedWaste: ["IT Assets", "Server Scraps", "Smartphones"]
                },
                {
                    name: "Hulladek Recycling",
                    address: "Indiranagar, Bengaluru",
                    location: {
                        type: "Point",
                        coordinates: [77.6412, 12.9716]
                    },
                    contact: "+91 80 4090 1234",
                    acceptedWaste: ["Home Appliances", "Mobile Phones", "Batteries"]
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
