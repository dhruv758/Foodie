const axios = require("axios")
const cheerio = require('cheerio');



exports.getZomatoData = async(req,res)=>{
    try {
      const {dish} = req.body;
      console.log(dish)
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



  exports.getSwigyData = async (req, res) => {
    try {
      const { dish } = req.body;
      console.log("Dish:", dish);
  
      // Use the dish variable in your URL if needed.
      // const url = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=28.6280075&lng=77.3607098&str=${encodeURIComponent(dish)}&trackingId=undefined&submitAction=SUGGESTION&queryUniqueId=cf78aefe-a2ab-e933-3267-2e7e32f9ca67&metaData=%7B%22type%22%3A%22DISH%22%2C%22data%22%3A%7B%22vegIdentifier%22%3A%22NA%22%2C%22cloudinaryId%22%3A%22Autosuggest%2FTop%2520200%2520queries%2FPizza.png%22%2C%22dishFamilyId%22%3A%22846647%22%2C%22dishFamilyIds%22%3A%5B%22846647%22%5D%7D%2C%22businessCategory%22%3A%22SWIGGY_FOOD%22%2C%22displayLabel%22%3A%22Dish%22%7D`;
      // const url = "https://www.swiggy.com/dapi/restaurants/list/v5?lat=18.9690247&lng=72.8205292&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
      const url = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=28.6280075&lng=77.3607098&str=${dish}&trackingId=undefined&submitAction=ENTER&queryUniqueId=33dc163c-b0c1-cde9-93e7-90a4e8945f00&selectedPLTab=RESTAURANT`
      // Make the axios GET request with appropriate headers.
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                        'Chrome/92.0.4515.131 Safari/537.36'
        }
      });
      
      const data = response.data.data.cards[0].groupedCard.cardGroupMap.RESTAURANT.cards
      return res.status(200).json(data);

    } catch (error) {
      console.error('Error fetching or processing data:', error.message);
      
      // If axios error response exists, use its status and message.
      if (error.response) {
        return res.status(error.response.status).json({
          error: error.response.data || 'Error fetching data'
        });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };



  exports.getSwigyRestaurantData = async (req, res) => {
    try {
      
  
      // Use the dish variable in your URL if needed.
      // const url = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=28.6280075&lng=77.3607098&str=${encodeURIComponent(dish)}&trackingId=undefined&submitAction=SUGGESTION&queryUniqueId=cf78aefe-a2ab-e933-3267-2e7e32f9ca67&metaData=%7B%22type%22%3A%22DISH%22%2C%22data%22%3A%7B%22vegIdentifier%22%3A%22NA%22%2C%22cloudinaryId%22%3A%22Autosuggest%2FTop%2520200%2520queries%2FPizza.png%22%2C%22dishFamilyId%22%3A%22846647%22%2C%22dishFamilyIds%22%3A%5B%22846647%22%5D%7D%2C%22businessCategory%22%3A%22SWIGGY_FOOD%22%2C%22displayLabel%22%3A%22Dish%22%7D`;
      const url = "https://www.swiggy.com/dapi/restaurants/list/v5?lat=18.9690247&lng=72.8205292&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
      // Make the axios GET request with appropriate headers.
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                        'Chrome/92.0.4515.131 Safari/537.36'
        }
      });
      
      const data = response.data.data.cards[0].card.card.imageGridCards
      console.log("Response data:", response.data.data.cards[0].card.card.imageGridCards);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching or processing data:', error.message);
      
      // If axios error response exists, use its status and message.
      if (error.response) {
        return res.status(error.response.status).json({
          error: error.response.data || 'Error fetching data'
        });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };


//  const restaurantId = 35270;
      // const name = "Biryani"
  // exports.getSeiggyRestaurantMenu = async(req,res)=>{
  //   try {
      
  //     // const {resturantId , name}= req.body;
  
  //     // Use the dish variable in your URL if needed.
  //     // const url = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=28.6280075&lng=77.3607098&str=${encodeURIComponent(dish)}&trackingId=undefined&submitAction=SUGGESTION&queryUniqueId=cf78aefe-a2ab-e933-3267-2e7e32f9ca67&metaData=%7B%22type%22%3A%22DISH%22%2C%22data%22%3A%7B%22vegIdentifier%22%3A%22NA%22%2C%22cloudinaryId%22%3A%22Autosuggest%2FTop%2520200%2520queries%2FPizza.png%22%2C%22dishFamilyId%22%3A%22846647%22%2C%22dishFamilyIds%22%3A%5B%22846647%22%5D%7D%2C%22businessCategory%22%3A%22SWIGGY_FOOD%22%2C%22displayLabel%22%3A%22Dish%22%7D`;
  //     // const url = "https://www.swiggy.com/dapi/restaurants/list/v5?lat=18.9690247&lng=72.8205292&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
  //     const resturantId = 650301;
  //     const name = "Rolls"
  //     const url =`https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.627981&lng=77.3648567&restaurantId=${resturantId}&query=${name}&submitAction=ENTER&source=collection`
  //     // Make the axios GET request with appropriate headers.
  //     const response = await axios.get(url, {
  //       headers: {
  //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
  //                       'AppleWebKit/537.36 (KHTML, like Gecko) ' +
  //                       'Chrome/92.0.4515.131 Safari/537.36'
  //       }
  //     });
      
  //     const data = response
  //     console.log("Response data:", data);
  //     return res.status(200).json(data);
  //   } catch (error) {
  //     console.error('Error fetching or processing data:', error.message);
      
  //     // If axios error response exists, use its status and message.
  //     if (error.response) {
  //       return res.status(error.response.status).json({
  //         error: error.response.data || 'Error fetching data'
  //       });
  //     }
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }
  // }
  exports.getSwiggyRestaurantMenu = async (req, res) => {
    try {
      const { restaurantId, name } = req.query;
      // const restaurantId = 57451;
      // const name = "South%20Indian"

      // const restaurantId = 35270;
      // const name = "Biryani"

      if (!restaurantId ) {
        return res.status(400).json({ error: 'restaurantId and name are required' });
      }
  
      const url = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.6284516&lng=77.37338&restaurantId=${restaurantId}&query=${name}&submitAction=ENTER&source=collection`;
      // const url = `https://www.swiggy.com/city/noida-1/dominos-pizza-a-block-sector-62-rest137369?restaurant_id=${restaurantId}&source=collection&query=&${name}`
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                        'Chrome/92.0.4515.131 Safari/537.36'
        }
      });
      
      const data = response.data.data.cards[5].groupedCard.cardGroupMap.REGULAR
      if(data.cards[1].card.card.title == "Top Picks"){
        const topPics = data.cards[1].card.card.carousel;
        const items =  data
        return res.status(200).json({topPics , items});
      }else{
        const items = data.cards
        return res.status(200).json(items);
      }
     
     
  
    } catch (error) {
      console.error('Error fetching Swiggy menu:', error.message);
      if (error.response) {
        return res.status(error.response.status).json({
          error: error.response.data || 'Error fetching data from Swiggy'
        });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };


// https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.6284516&lng=77.37338&restaurantId=137369&query=Pizza&submitAction=ENTER&source=collection

  // https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.627981&lng=77.3648567&restaurantId=650301&query=Roll&submitAction=ENTER&source=collection

  // https://media-assets.swiggy.com/swiggy/image/upload