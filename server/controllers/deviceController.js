const Device = require('../models/Device');
const Hazard = require('../models/Hazard');

// Comprehensive e-waste mapping for in-depth results
const wasteDatabase = {
    'smartphone': {
        hazardLevel: 'High',
        hazards: [
            { element: 'Lithium', risk: 'Highly reactive, fire risk if punctured, environmental toxicity.' },
            { element: 'Cobalt', risk: 'Mining ethics and high toxicity in soil/water.' },
            { element: 'Arsenic', risk: 'Found in microchips; chronic exposure is carcinogenic.' }
        ],
        process: [
            'Battery Extraction: Safely remove Li-ion battery for specialized processing.',
            'Manual Dismantling: Separate screen, circuit boards, and plastic casing.',
            'Material Recovery: Smelt circuit boards to recover gold, silver, and copper.',
            'Shredding: Process plastic and glass into secondary raw materials.'
        ]
    },
    'laptop': {
        hazardLevel: 'High',
        hazards: [
            { element: 'Mercury', risk: 'Used in LCD backlights; potent neurotoxin.', },
            { element: 'Lead', risk: 'Found in CRT monitors and solder; causes cognitive damage.', },
            { element: 'Brominated Flame Retardants', risk: 'PBT substances that accumulate in humans.' }
        ],
        process: [
            'Hazardous Removal: Extract mercury-containing backlights and CMOS batteries.',
            'Partial Shredding: Mechanical separation of ferrous and non-ferrous metals.',
            'Electromagnetic Separation: Filter out precious metal components.',
            'Polishing: Refine recovered glass for industrial reuse.'
        ]
    },
    'battery': {
        hazardLevel: 'High',
        hazards: [
            { element: 'Cadmium', risk: 'Extremely toxic to kidneys and bones.', },
            { element: 'Sulfuric Acid', risk: 'Causes severe chemical burns and soil acidification.' }
        ],
        process: [
            'Neutralization: Stabilize acids and reactive chemicals.',
            'Hydrometallurgical Processing: Use aqueous chemistry for metal recovery.',
            'Pyrometallurgical Treatment: High-heat smelting to isolate nickel and cadmium.'
        ]
    },
    'monitor': {
        hazardLevel: 'High',
        hazards: [
            { element: 'Phosphor Powder', risk: 'Toxic when inhaled; used in older CRT screens.', },
            { element: 'Barium', risk: 'Used to protect users from X-rays; toxic but stable unless crushed.' }
        ],
        process: [
            'Glass Separation: Separate panel glass from funnel glass (which contains lead).',
            'Phosphor Recovery: Vacuum remove phosphor coating for hazardous waste disposal.',
            'Metal Extraction: Recover steel and copper from yolk and housing.'
        ]
    },
    'cable': {
        hazardLevel: 'Medium',
        hazards: [
            { element: 'PVC', risk: 'Releases dioxins when burned; non-biodegradable.', },
            { element: 'Phthalates', risk: 'Endocrine disruptors found in plastic insulation.' }
        ],
        process: [
            'Mechanical Stripping: Strip insulation from copper wire.',
            'Granulation: Chop cables into fine pieces for density separation.',
            'Refining: Purify copper through electrolysis.'
        ]
    }
};

const genericFallback = {
    hazardLevel: 'Medium',
    hazards: [
        { element: 'Complex Polymers', risk: 'Hard-to-recycle plastics that may contain stabilizers.', },
        { element: 'Heavy Metals', risk: 'Potential trace amounts of lead or cadmium in solder.' },
        { element: 'Residual Charge', risk: 'Risk of electric shock or short circuit if disassembled roughly.' }
    ],
    process: [
        'Safe Storage: Keep in a dry place to prevent leaching of chemicals.',
        'Collection: Deliver to a certified e-waste aggregator.',
        'Sorting: Professionals will categorize the device for component recovery.',
        'Downcycling: Materials that cannot be recovered will be safely downcycled.'
    ]
};

exports.classifyDevice = async (req, res) => {
    try {
        const { name, category, imageUrl } = req.body;
        const uploadedImageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const key = Object.keys(wasteDatabase).find(k =>
            name.toLowerCase().includes(k) || category.toLowerCase().includes(k)
        );

        let hazardLevel = 'Low';
        let recommendations = ['Recycle at verified E-waste center'];
        let classificationResults = `Detected ${name} as ${category}. Standard recycling protocols apply.`;
        let detailedData = {};

        if (key) {
            const data = wasteDatabase[key];
            hazardLevel = data.hazardLevel;
            recommendations = data.process;
            classificationResults = `Scientific Analysis: This device contains critical hazards. ${data.hazards.map(h => h.element).join(', ')} were identified.`;
            detailedData = data;
        } else {
            // Apply generic fallback for unknown devices
            hazardLevel = genericFallback.hazardLevel;
            recommendations = genericFallback.process;
            classificationResults = `General Analysis: This ${category} requires professional handling to prevent environmental impact from plastics and trace metals.`;
            detailedData = genericFallback;
        }

        const device = new Device({
            userId: req.user.id,
            name,
            category,
            hazardLevel,
            classificationResults,
            recommendations,
            imageUrl: uploadedImageUrl || imageUrl,
            detailedData // Store the enriched data
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

        // Calculate daily activity for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const activity = await Device.aggregate([
            { $match: { userId: req.user.id, createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const activityMap = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            activityMap[dateStr] = { name: days[d.getDay()], count: 0 };
        }

        activity.forEach(item => {
            if (activityMap[item._id]) {
                activityMap[item._id].count = item.count;
            }
        });

        const dailyActivity = Object.values(activityMap).reverse();

        res.json({
            totalDevices: total,
            highHazardDevices: highHazard,
            co2Saved: total * 2.5,
            impactScore: total * 50 + (highHazard * 100),
            dailyActivity
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
