export const searchDish = async (searchInput) => {

    const formattedText = searchInput.toLowerCase().replace(/\s+/g, '-');
    const convertInputIntoLowercase = formattedText.toLowerCase();

  try {
    const response = await fetch("http://localhost:3000/api/zomato", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dish: convertInputIntoLowercase }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Search request successful in zomato api:", data);
    return data; // Return data for further processing
  } catch (error) {
    console.error("There was an error during the search request:", error);
    throw error; // Re-throw to handle error at call site
  }
};