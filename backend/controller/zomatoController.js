const axios = require("axios")
const cheerio = require('cheerio');



exports.getZomatoData = async(req,res)=>{
    try {
      const {dish} = req.body;
      
        const url = `https://www.zomato.com/ncr/delivery/dish-${dish}`;
        console.log(url);
        const response = await axios.get(url, {
            headers: {
              // Mimic a browser request to avoid being blocked
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                            'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                            'Chrome/92.0.4515.131 Safari/537.36'
            }
          });
          
          const html = response.data;

          const $ = cheerio.load(html);
    
          // 3. Search for the specific script tag containing the data.
          // Adjust the selector depending on the actual page structure.
  
        let itemListData = null;
        $('script[type="application/ld+json"]').each((i, el) => {
          const scriptContent = $(el).html().trim();
          try {
            const jsonData = JSON.parse(scriptContent);
            // 4. Check if this script tag contains the ItemList data
            if (jsonData["@type"] === "ItemList") {
              itemListData = jsonData;
              return false; // Break out of the loop when found
            }
          } catch (e) {
            console.error('Error parsing JSON:', e.message);
          }
        });

        if (!itemListData) {
            return res.status(500).json({ error: 'ItemList data not found' });
        }
        const restaurants = itemListData.itemListElement || [];

        console.log(restaurants);
        return res.status(200).json(restaurants);

        
      } catch (error) {
        console.error('Error fetching or processing data:', error.message);
        res.status(500).json({ error: 'Error fetching data' });
      }
  }