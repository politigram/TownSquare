export default async function handler(req, res) {
    const { zip } = req.query;
  
    if (!zip) {
      return res.status(400).json({ error: 'ZIP code is required' });
    }
  
    const apiKey = process.env.GOOGLE_CIVIC_API_KEY;
    if (!apiKey) {
      console.error("API key is missing");
      return res.status(500).json({ error: 'API key not configured' });
    }
  
    const apiUrl = `https://www.googleapis.com/civicinfo/v2/representatives?key=${apiKey}&address=${zip}`;
  
    try {
      console.log(`Fetching from: ${apiUrl}`); // Log the API request
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        const errorText = await response.text(); // Get error details
        console.error(`Error fetching officials: ${errorText}`);
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Fetch error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
  