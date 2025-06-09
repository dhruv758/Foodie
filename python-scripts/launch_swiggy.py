import json
import os
import time
import sys

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
# from webdriver_manager.chrome import ChromeDriverManager


# === Headless setup for Lambda ===
def get_driver():
    chrome_options = Options()
    chrome_options.binary_location = "/opt/chrome/chrome"
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1280x1696")
    chrome_options.add_argument("--single-process")
    chrome_options.add_argument("--disable-dev-tools")
    chrome_options.add_argument("--no-zygote")

    chrome_driver_path = "/opt/chromedriver"
    service = Service(chrome_driver_path)

    return webdriver.Chrome(service=service, options=chrome_options)


def extract_restaurant_name(url):
    parts = url.split("/")
    slug = parts[-1]
    name = slug.split("-")[:-1]  # remove restID part
    return " ".join(word.capitalize() for word in name)

def run_swiggy_automation(name, vote_count, restaurant_name):
    driver = get_driver()
    wait = WebDriverWait(driver, 10)
    driver.get("https://www.swiggy.com/restaurants")
    time.sleep(3)
    
    # Wait for and click the "Sign In" button
    try:
        sign_in_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Sign In']")))
        sign_in_button.click()

        # Wait for phone number input field to appear
        phone_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='tel']")))

        # Enter a phone number
        phone_input.send_keys("8077580899")  # Replace with test number

        # Click the login button
        login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Login')]")))
        login_button.click()

    
    except Exception as e:
        print("Login step failed:", e)

    # Click on "VERIFY OTP" button (after user enters OTP)
    try:
        otp_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@maxlength='6' and @type='text']")))
    
        # Wait until the OTP input has exactly 6 digits
        WebDriverWait(driver, 60).until(lambda d: len(otp_input.get_attribute("value")) == 6)
        print("✅ OTP entered by user.")
        
        verify_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'VERIFY OTP')]")))
        verify_button.click()
        print("Clicked VERIFY OTP button.")
    except:
        print("VERIFY OTP button not found or not clickable.")

    
    # Click "Change" button for location
    try:
        location_edit = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@role='button' and @tabindex='0']")))
        location_edit.click()
        print("✅ Clicked location change button.")
        time.sleep(3)
    except:
        print("❌ Could not click the location change button.")


    # Enter new address and click first suggestion
    try:
        location_input_container = wait.until(EC.presence_of_element_located((By.XPATH, "//div[child::input[@type='text' and @placeholder='Search for area, street name..']]")))
        input_box = location_input_container.find_element(By.TAG_NAME, "input")
        input_box.clear()
        input_box.send_keys("concirus, 13/1, Block A, Industrial Area, Sector 62, Noida, Uttar Pradesh 201309, India")
        print("✅ Entered address in location field.")
        time.sleep(3)
    
        # Wait for suggestions and click the first one
        first_suggestion = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, "//div[@class='_2RwM6']")))
        first_suggestion.click()
        print("✅ Clicked the first location suggestion.")
        time.sleep(3)

    except Exception as e:
        print("❌ Failed to enter or select location:", e)


    # Wait and click "Skip & Add Later" button if it appears
    try:
        skip_button = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, "//a[.//div[text()='SKIP & ADD LATER']]")))
        skip_button.click()
        print("✅ Clicked 'Skip & Add Later' button.")
        time.sleep(3)
    except:
        print("⚠️ 'Skip & Add Later' button not found or already skipped.")

    # Load food data from JSON file
    try:
        json_path = os.path.join(os.path.dirname(__file__), "temp_data.json")
        with open(json_path, "r") as file:
            food_data = json.load(file)

        food_name = food_data["name"]
        vote_count = int(food_data["voteCount"])
        restaurant_name = food_data["restaurantName"]  
        food_name = food_name.split("/")[0].strip()
        print(f"✅ Loaded data: Restaurant = {restaurant_name}, Food = {food_name}, Votes = {vote_count}")
    except Exception as e:
        print("❌ Failed to read food data:", e)
        driver.quit()
        exit()

    # Click Search Icon
    try:
        search_icon = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Search']/ancestor::div[1]")))
        search_icon.click()
        print("✅ Clicked on Search icon.")
        time.sleep(3)
    except Exception as e:
        print("❌ Failed to click search icon:", e)

    # Enter Restaurant Name
    try:
        search_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Search for restaurants and food']")))
        search_input.send_keys(restaurant_name)
        print(f"🔍 Searching for restaurant: {restaurant_name}")
        time.sleep(3)
    except Exception as e:
        print("❌ Failed to enter restaurant name:", e)

    # Click on Restaurant
    try:
        restaurant_result = wait.until(EC.element_to_be_clickable((By.XPATH, f"//button[contains(normalize-space(.), '{restaurant_name}')]")))
        restaurant_result.click()
        print(f"✅ Opened restaurant: {restaurant_name}")
        time.sleep(3)
    except Exception as e:
        print("❌ Could not find or open restaurant:", e)


    try:
        particular_restaurant = wait.until(EC.presence_of_element_located((By.XPATH, "(//div[@data-testid='search-pl-restaurant-card'])[1]")))
        particular_restaurant.click()
        print("✅ Restaurant landing page loaded.")
    except:
        print("⚠️ Couldn't confirm landing page, continuing anyway...")


    # Open Search
    try:
        menu_search = wait.until(EC.presence_of_element_located((By.XPATH, "//div[text()='Search for dishes']/parent::button")))
        menu_search.click()
        print("✅ Clicked on Menu Search icon.")
        time.sleep(2)
    except Exception as e:
        print("❌ Failed to click on Menu Search icon:", e)

    # Input Food Name
    try:
        menu_search_input = wait.until(EC.presence_of_element_located((By.XPATH, "//label[.//input[starts-with(@placeholder, 'Search in ')]]//input")))
        menu_search_input.send_keys(food_name)
        print(f"🔍 Searched for food item: {food_name}")
        time.sleep(2)
    except Exception as e:
        print(f"❌ Failed to search for food item '{food_name}':", e)

    # Find and Click Add
    try:
        food_cards = driver.find_elements(By.XPATH, "//div[@data-testid='normal-dish-item']")
        if not food_cards:
            print(f"❌ Food item '{food_name}' not found in the menu.")
            driver.quit()
            exit()
        print("✅ Found matching food item.")

        add_button = food_cards[0].find_element(By.XPATH, ".//button[.//div[contains(text(), 'Add')]][2]")
        add_button.click()
        print("🛒 Clicked 'Add' on first food item.")
        time.sleep(2)
    except Exception as e:
        print("❌ Failed to click 'Add' on food item:", e)

    #  Handle Continue/Add Item
    try:
        while True:
            clicked_any = False
            try:
                continue_button = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, "//div//div//button[.//span[text()='Continue']]")))
                continue_button.click()
                print("➡️ Clicked 'Continue' button.")
                clicked_any = True
                time.sleep(2)
            except:
                pass

            try:
                final_add_button = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, "//div//div//button[.//span[contains(text(), 'Add Item to cart')]]")))
                final_add_button.click()
                print("🛒 Clicked 'Add item to cart' button.")
                clicked_any = True
                time.sleep(2)
                # ✅ Immediately check for the toast about choice requirement
                try:
                    toast = WebDriverWait(driver, 2).until(EC.presence_of_element_located((By.XPATH, "//div[starts-with(text(), 'You must select')]")))
                    if toast.is_displayed():
                        print("⚠️ Selection required (e.g., bread/topping). Waiting 6 seconds for user to respond...")
                        time.sleep(6)

                        # ✅ Try clicking the button again after user selection
                    try:
                        final_add_button_retry = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, "//div//div//button[.//span[contains(text(), 'Add Item to cart')]]")))
                        final_add_button_retry.click()
                        print("✅ Clicked 'Add item to cart' again after user selection.")
                        time.sleep(2)
                        break
                    except :
                        print("❌ User didn't select option or retry failed. Skipping this item.")
                        break
                except:
                    print("✅ No choice toast found, assuming item was added successfully.")
                    break
            except:
                pass

            if not clicked_any:
                print("❌ Neither 'Continue' nor 'Add Item to cart' button found.")
                break
    except Exception as e:
        print("⚠️ Error while handling Continue/Add item flow:", e)

    #  Quantity votes
    for i in range(vote_count - 1):
        try:
        
            time.sleep(1)

            plus_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[div[text()='+']]")))
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", plus_button)
            plus_button.click()
            print(f"➕ Clicked '+' for item {i + 2}")
            time.sleep(1)

            # Click 'Repeat' button (if needed)
            repeat_buttons = driver.find_elements(By.XPATH, "//button[.//span[contains(text(), 'Repeat')]]")
            if repeat_buttons:
                repeat_buttons[0].click()
                print(f"🔁 Clicked 'Repeat' for item {i + 2}")
                time.sleep(1)
            else:
                print(f"⚠️ No 'Repeat' button appeared at vote {i + 2}")
        except Exception as e:
            print(f"❌ Failed during vote iteration {i + 2}: {e}")
            break

     # Click on Cart
    try:
        cart_button = wait.until(EC.presence_of_element_located((By.XPATH, "//span[text()='Cart']")))
        cart_button.click()
        print("✅ Clicked on Cart icon.")
        time.sleep(2)
    except Exception as e: 
        print("❌ Failed to click on Cart icon:", e)

    
    print("\n📌 Browser is open. Leave it running and inspect if needed.")
    print("🔴 Press Ctrl+C to exit and close the browser.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🔴 Script interrupted by user.")
    finally:
        try:
            driver.quit()
            print("✅ Browser closed successfully!")
        except:
            print("⚠️ Could not close browser cleanly.")
