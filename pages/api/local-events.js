const ZIPCODEBASE_API_KEY = process.env.ZIPCODEBASE_API_KEY;

// ✅ Function to fetch city & state from ZIP
async function fetchCityFromZip(zip) {
  try {
    const response = await fetch(
      `https://app.zipcodebase.com/api/v1/search?codes=${zip}&country=us&apikey=${ZIPCODEBASE_API_KEY}`
    );
    const data = await response.json();

    if (!data.results || !data.results[zip] || data.results[zip].length === 0) {
      throw new Error("Invalid ZIP code response");
    }

    // ✅ Ensure only U.S. locations are returned
    const usResults = data.results[zip].filter(entry => entry.country_code === "US");

    if (usResults.length === 0) {
      throw new Error("No U.S. location found for this ZIP code.");
    }

    return usResults[0]; // ✅ Returns { city: "Boston", state: "MA" }
  } catch (error) {
    console.error("Error fetching city from ZIP:", error);
    return null;
  }
}

// ✅ Ensure the API route exports a default function
export default async function handler(req, res) {
  const { zip } = req.query;

  if (!zip) {
    return res.status(400).json({ message: "ZIP code is required." });
  }

  try {
    const cityData = await fetchCityFromZip(zip);
    if (!cityData) {
      return res.status(404).json({ message: "City not found for this ZIP code." });
    }

    res.status(200).json({ city: cityData.city, state: cityData.state });
  } catch (error) {
    console.error("Error fetching city from ZIP:", error);
    res.status(500).json({ message: "Error fetching city data", error });
  }
}

