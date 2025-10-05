import { GoogleGenAI, Type } from "@google/genai";
import type { SearchParams, Area } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function findAreas(params: SearchParams): Promise<Area[]> {
  const { location, radius, unit, desiredFeatures, crewSize } = params;

  let prompt = `
    You are a simulated AI assistant for a film location scout. Your task is to identify and generate a list of suitable public areas or neighborhoods for a film shoot.
    The user is looking for locations within a ${radius} ${unit} radius of "${location}".
    The production will have a crew of approximately ${crewSize} people. This is a crucial factor. Areas with insufficient infrastructure for a crew of this size should be scored lower.
  `;

  if (desiredFeatures && desiredFeatures.trim() !== '') {
    prompt += `

    The user is looking for locations with the following specific features for the scene: "${desiredFeatures}".

    For each location, please provide a 'featureAnalysis'. This should be an array of objects. For each distinct feature requested by the user, create an object with the 'feature' name (string) and a 'present' property (boolean) indicating if that feature is available.
    Also provide a detailed 'summary' paragraph (3-4 sentences) explaining the area's overall suitability for the scene and production logistics, considering the crew size. This summary will be shown on a details page.
    
    Please generate a list of 3 to 5 realistic public areas or neighborhoods that best match these criteria.
    `;
  } else {
      prompt += `

      Please generate a list of 3 to 5 interesting or notable public areas or neighborhoods within the specified search radius that would be suitable for a film shoot.

      For each area's summary, please explain why the area is notable and logistically viable for the crew size. Since no features were requested, return an empty array for 'featureAnalysis'.
      `;
  }

  prompt += `
    For each location you identify, provide:
    1. A concise name for the location (e.g., "Le Marais District, Paris", "Downtown Core, Vancouver").
    2. The 'featureAnalysis' array as described above.
    3. The detailed 'summary' as described above.
    4. A central latitude and longitude.
    5. An appropriate radius for the area in meters (e.g., 500 for a small neighborhood, 1500 for a larger district).
    6. For informational purposes, provide your estimated availability for the following resources, keeping the crew size of ${crewSize} in mind. For each, provide an object with 'available' and 'total' counts:
        - Accommodation: Estimate the number of available hotel rooms ('available') out of the total rooms in the area ('total'). Also provide an 'accommodationCapacity' text description with an estimate of the number of people that can be accommodated (e.g., 'Capacity for over 300 people'). Provide a list of 2-3 real-world hotel examples as an array of objects in 'exampleHotels', where each object has a 'name' (string) and a 'priceRange' (string, e.g., "$150-$250/night").
        - Catering: Estimate the number of catering services/large restaurants suitable for a film crew ('available') out of the total services in the area ('total'). Provide a list of 2-3 real-world catering or large restaurant examples in 'exampleCatering'.
        - Parking: Estimate the number of large parking lots or garages suitable for a production crew's vehicles that are likely available ('available') out of the total number of suitable lots/garages in the area ('total'). These numbers should represent entire lots or garages, not individual parking spots. Provide a list of 2-3 real-world parking garage or large lot examples in 'exampleParking'.

    Return the response ONLY as a JSON array of objects, conforming to the provided JSON schema. Do not include any other text, explanations, or markdown formatting.
  `;


  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: {
          type: Type.STRING,
          description: "The name of the area or neighborhood.",
        },
        summary: {
            type: Type.STRING,
            description: "A detailed summary of the area's suitability for a film shoot, for use in a details view.",
        },
        featureAnalysis: {
          type: Type.ARRAY,
          description: "An analysis of the user's desired features and their presence at the location.",
          items: {
            type: Type.OBJECT,
            properties: {
              feature: { type: Type.STRING },
              present: { type: Type.BOOLEAN },
            },
            required: ["feature", "present"],
          },
        },
        lat: {
          type: Type.NUMBER,
          description: "The central latitude of the area.",
        },
        lng: {
          type: Type.NUMBER,
          description: "The central longitude of the area.",
        },
        areaRadius: {
          type: Type.NUMBER,
          description: "The radius of the area in meters."
        },
        scores: {
          type: Type.OBJECT,
          properties: {
            accommodation: {
              type: Type.OBJECT,
              description: "Estimated available and total hotel rooms.",
              properties: {
                  available: { type: Type.NUMBER },
                  total: { type: Type.NUMBER },
              },
              required: ["available", "total"],
            },
            catering: {
              type: Type.OBJECT,
              description: "Estimated available and total suitable catering services.",
              properties: {
                  available: { type: Type.NUMBER },
                  total: { type: Type.NUMBER },
              },
              required: ["available", "total"],
            },
            parking: {
              type: Type.OBJECT,
              description: "Estimated number of available large parking lots/garages out of the total suitable lots/garages in the area.",
              properties: {
                  available: { type: Type.NUMBER },
                  total: { type: Type.NUMBER },
              },
              required: ["available", "total"],
            },
            accommodationCapacity: {
              type: Type.STRING,
              description: "A textual description of the estimated number of people that can be accommodated."
            },
            exampleHotels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  priceRange: { type: Type.STRING },
                },
                required: ["name", "priceRange"],
              },
              description: "A list of 2-3 real-world hotel examples with their estimated price range."
            },
            exampleCatering: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 2-3 real-world catering or large restaurant examples."
            },
            exampleParking: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 2-3 real-world parking garage examples."
            }
          }
        },
      },
      required: ["name", "summary", "featureAnalysis", "lat", "lng", "areaRadius", "scores"],
    },
  };
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedAreas: Omit<Area, 'id'>[] = JSON.parse(jsonText);
    
    // Add a unique ID to each location for React keys
    return parsedAreas.map(area => ({
      ...area,
      id: crypto.randomUUID(),
    }));

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate areas from AI service.");
  }
}