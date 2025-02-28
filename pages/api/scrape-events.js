export default async function handler(req, res) {
    const { zip } = req.query;
  
    if (!zip) {
      return res.status(400).json({ message: "ZIP code is required." });
    }
  
    try {
      const cityData = await fetchCityFromZip(zip);
      if (!cityData) return res.status(404).json({ message: "City not found for this ZIP code." });
  
      const { city, state } = cityData;
      const citySlug = city.toLowerCase().replace(/\s+/g, "-"); // Convert to URL-friendly format
      const stateSlug = state.toLowerCase();
  
      // ✅ Focus on high-confidence URLs (Avoid random combinations)
      const possibleUrls = [
        `https://${citySlug}.gov/events`, // ✅ Most reliable (official city site)
        `https://www.${citySlug}.gov/events`, // ✅ Some cities use this format
        `https://www.${stateSlug}.gov/events`, // ✅ State-level events
        `https://www.${citySlug}chamber.org/events`, // ✅ Chamber of commerce for activism events
        `https://${stateSlug}.legislature.gov/calendar` // ✅ State legislature events
      ];
  
      console.log(`🔍 Prioritized URLs for ${city}, ${state} (ZIP: ${zip}):`);
      possibleUrls.forEach((url) => console.log(url));
  
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
  
      let events = [];
  
      for (const url of possibleUrls) {
        try {
          console.log(`📡 Checking URL: ${url}`);
          const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  
          if (response.status() !== 200) {
            console.warn(`❌ Skipping ${url} - Page not found (Status: ${response.status()})`);
            continue;
          }
  
          const siteEvents = await page.evaluate(() => {
            const eventElements = document.querySelectorAll(".event-item"); // Adjust this selector
            return Array.from(eventElements).map(event => ({
              title: event.querySelector(".event-title")?.innerText || "No title",
              date: event.querySelector(".event-date")?.innerText || "No date",
              location: event.querySelector(".event-location")?.innerText || "No location",
              description: event.querySelector(".event-description")?.innerText || "No description",
              link: event.querySelector("a")?.href || "No link"
            }));
          });
  
          events = [...events, ...siteEvents];
        } catch (err) {
          console.warn(`❌ Skipping ${url} - Error occurred`);
        }
      }
  
      await browser.close();
      res.status(200).json({ events });
  
    } catch (error) {
      console.error("Error scraping events:", error);
      res.status(500).json({ message: "Error fetching events", error });
    }
  }
  