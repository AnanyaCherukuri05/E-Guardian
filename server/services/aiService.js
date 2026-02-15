const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Analyzes an electronic device using AI to provide detailed hazard assessment
 * and recycling recommendations
 */
async function analyzeDevice(deviceName, category) {
    try {
        const prompt = `Analyze the following electronic device for e-waste recycling purposes:

Device: ${deviceName}
Category: ${category}

Please provide a comprehensive analysis in the following JSON format:
{
  "hazardLevel": "Low/Medium/High",
  "hazardousMaterials": ["list of hazardous materials present"],
  "environmentalImpact": "detailed description of environmental impact",
  "safetyPrecautions": ["list of safety precautions when handling"],
  "recyclingSteps": ["detailed step-by-step recycling instructions"],
  "componentBreakdown": "description of major components and their recyclability",
  "disposalWarnings": ["important warnings about disposal"],
  "estimatedValue": "estimated recyclable material value",
  "carbonFootprint": "estimated carbon impact if properly recycled vs landfill"
}

Be specific, detailed, and scientifically accurate. Focus on practical information for e-waste recycling.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert e-waste recycling consultant with deep knowledge of electronics, environmental science, and hazardous materials. Provide detailed, accurate, and actionable information."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content);
        return analysis;
    } catch (error) {
        console.error('AI Analysis Error:', error);
        // Fallback to enhanced mock data if API fails
        return getFallbackAnalysis(deviceName, category);
    }
}

/**
 * Provides enhanced fallback analysis if AI service is unavailable
 */
function getFallbackAnalysis(deviceName, category) {
    const isHighRisk = category.toLowerCase().includes('battery') || 
                       deviceName.toLowerCase().includes('phone') ||
                       deviceName.toLowerCase().includes('laptop') ||
                       category.toLowerCase().includes('monitor');

    return {
        hazardLevel: isHighRisk ? 'High' : 'Medium',
        hazardousMaterials: isHighRisk 
            ? ['Lithium-ion batteries', 'Lead', 'Mercury', 'Cadmium', 'Brominated flame retardants', 'Beryllium']
            : ['Lead', 'PVC plastics', 'Polychlorinated biphenyls (PCBs)'],
        environmentalImpact: `${deviceName} contains materials that can contaminate soil and water if improperly disposed. Heavy metals can persist in the environment for decades and enter the food chain. Proper recycling can recover valuable materials like gold, silver, copper, and rare earth elements while preventing environmental harm.`,
        safetyPrecautions: [
            'Wear protective gloves when handling',
            isHighRisk ? 'Keep away from heat sources and avoid puncturing batteries' : 'Handle with care to avoid cuts from sharp edges',
            'Store in a cool, dry place before recycling',
            'Do not attempt to disassemble without proper training',
            'Keep away from children and pets'
        ],
        recyclingSteps: [
            'Back up and erase all personal data from the device',
            'Remove any batteries if safely accessible',
            'Check if the device is still functional - consider donation or refurbishment',
            'Locate a certified e-waste recycling center near you',
            'Transport safely in a padded container',
            'Request a receipt or certificate of proper disposal',
            'Ask the facility about their recycling process and certifications (R2 or e-Stewards)'
        ],
        componentBreakdown: `${deviceName} typically contains: Circuit boards with precious metals (gold, silver, copper), plastic housing (recyclable), glass components, various metal alloys, and electronic components. Approximately 80% of the device by weight is recyclable. The remaining 20% requires special hazardous waste handling.`,
        disposalWarnings: [
            'NEVER throw in regular trash - illegal in many jurisdictions',
            'Do not burn or incinerate - releases toxic fumes',
            'Avoid landfill disposal - contaminates groundwater',
            isHighRisk ? 'Battery may explode if damaged or overheated' : 'May contain mercury in switches or displays',
            'Improper disposal may result in fines or legal penalties'
        ],
        estimatedValue: isHighRisk 
            ? 'Contains $5-15 worth of recoverable materials including precious metals and rare earth elements'
            : 'Contains $2-8 worth of recoverable metals and plastics',
        carbonFootprint: `Proper recycling can save approximately 20-50kg of CO2 emissions compared to manufacturing from virgin materials. Landfill disposal would contribute to methane production and prevent material recovery, resulting in 3-5x higher carbon impact over the device lifecycle.`
    };
}

module.exports = { analyzeDevice };
