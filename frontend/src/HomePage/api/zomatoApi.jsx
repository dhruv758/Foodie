export const searchDish = async (searchInput) => {

    const formattedText = searchInput.toLowerCase().replace(/\s+/g, '-');
  
    // const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.6280075&lng=77.3607098&collection=83633&tags=layout_CCS_${convertInputIntoLowercase}&sortBy=&filters=&type=rcv2&offset=0&page_type=null`
  try {
    const response = await fetch("http://localhost:3000/api/swiggy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dish: formattedText }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data =await response.json();
    console.log("Search request successful in zomato:", data);
    return data; // Return data for further processing
  } catch (error) {
    console.error("There was an error during the search request:", error);
    throw error; // Re-throw to handle error at call site
  }
};