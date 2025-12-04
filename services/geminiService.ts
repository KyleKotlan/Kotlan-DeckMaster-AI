import { GoogleGenAI, Type } from "@google/genai";
import { DeckDimensions, MaterialCategory } from "../types";

export const generateMaterialList = async (dimensions: DeckDimensions): Promise<MaterialCategory[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Calculate a detailed Bill of Materials (BOM) for a residential deck with the following specifications:
    - Dimensions: ${dimensions.length} feet long by ${dimensions.width} feet wide.
    - Height off ground: ${dimensions.height} inches.
    - Deck Surface Material: ${dimensions.material}.
    - Structure: Standard residential framing (16" o.c. joists, appropriate beams and posts based on load).
    ${dimensions.additionalDetails ? `- SPECIAL INSTRUCTIONS/USER NOTES: "${dimensions.additionalDetails}" (Please incorporate these requirements into the material list calculations).` : ''}
    
    CRITICAL CONSTRAINTS:
    1. BEAMS: Do NOT use built-up 2x lumber (e.g., (2) 2x10) for beams. Use solid timber (4x or larger, e.g., 4x8, 4x10, 6x10) or appropriate engineered beams.
    2. CONCRETE: Use 60lb bags for all concrete footing calculations.
    
    Include estimations for:
    1. Framing Lumber (Ledger boards, Joists, Beams, Posts, Rim Joists).
    2. Decking Boards (Assume standard width for the chosen Deck Surface Material).
    3. Hardware (Joist hangers, Structural screws, Deck screws/fasteners, Bolts/Lags for ledger and posts).
    4. Concrete (Bags of mix for footings, calculated in 60lb bags).
    5. Railing (if height > 30 inches, otherwise optional but include if good practice).
    
    Add a 'notes' field for each item explaining the calculation logic (e.g., "15 joists needed for 12ft span @ 16oc + 1 end").
    Ensure quantities include a 10% waste factor where appropriate.
  `;

  // Define the schema for structured JSON output
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        categoryName: {
          type: Type.STRING,
          description: "The category of materials (e.g., Lumber, Hardware, Concrete, Finishes)."
        },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Specific name of the item (e.g., 4x10x12' Pressure Treated Beam)" },
              quantity: { type: Type.NUMBER, description: "Estimated quantity needed" },
              unit: { type: Type.STRING, description: "Unit of measure (e.g., boards, lbs, box, bags)" },
              notes: { type: Type.STRING, description: "Reasoning for the quantity or specific usage instructions" }
            },
            required: ["name", "quantity", "unit", "notes"]
          }
        }
      },
      required: ["categoryName", "items"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2, // Low temperature for more deterministic/math-based results
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    return JSON.parse(text) as MaterialCategory[];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};