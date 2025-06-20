import json
import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# --- Helper to force swiggy.com/restaurants page to open ---
def force_open_restaurant_page(driver):
    print(":globe_with_meridians: Attempting to open /restaurants page directly...")
    driver.get("https://www.swiggy.com/restaurants")
    time.sleep(3)

    # If redirected to homepage, try setting location
    if "restaurants" not in driver.current_url:
        print(":warning: Redirected to homepage. Setting location and retrying...")

        driver.get("https://www.swiggy.com")
        time.sleep(2)

        # Set location via JS (simulate browser localStorage)
        driver.execute_script("""
            window.localStorage.setItem("swgy_location", JSON.stringify({
                "address": "Concirrus, 13/1, Block A, Industrial Area, Sector 62, Noida",
                "area": "Sector 62",
                "city": "Noida",
                "lat": "28.6304",
                "lng": "77.3732",
                "locationType": "GEOCODE"
            }));
        """)
        print(":white_check_mark: Location set via localStorage.")

        time.sleep(1)
        driver.get("https://www.swiggy.com/restaurants")
        time.sleep(3)

    if "restaurants" in driver.current_url:
        print(":rocket: Successfully opened /restaurants!")
    else:
        print(":x: Failed to open /restaurants even after retry.")
        driver.quit()
        exit()


# --- Setup Chrome options ---
chrome_options = Options()
chrome_options.add_argument("--start-maximized")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# --- Connect to remote Selenium (Docker container) ---
driver = webdriver.Remote(
    command_executor="http://selenium-chrome:4444/wd/hub",
    options=chrome_options
)

# --- Force open /restaurants ---
force_open_restaurant_page(driver)

wait = WebDriverWait(driver, 10)

# Continue with original script logic from here ↓↓↓

sign_in_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Sign In']")))
sign_in_button.click()

phone_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='tel']")))
print(":iphone: Waiting for user to enter phone number manually...")

try:
    WebDriverWait(driver, 60).until(lambda d: len(phone_input.get_attribute("value")) == 10)
    print(":white_check_mark: Phone number entered by user.")
    login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Login')]")))
    login_button.click()
    print(":closed_lock_with_key: Clicked Login button.")
except:
    print(":x: User did not enter phone number in 60 seconds.")
    driver.quit()
    exit()

try:
    otp_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@maxlength='6' and @type='text']")))
    WebDriverWait(driver, 60).until(lambda d: len(otp_input.get_attribute("value")) == 6)
    print(":white_check_mark: OTP entered by user.")
    verify_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'VERIFY OTP')]")))
    verify_button.click()
    print("Clicked VERIFY OTP button.")
except:
    print("VERIFY OTP button not found or not clickable.")

try:
    location_edit = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@role='button' and @tabindex='0']")))
    location_edit.click()
    print(":white_check_mark: Clicked location change button.")
    time.sleep(3)
except:
    print(":x: Could not click the location change button.")

try:
    location_input_container = wait.until(EC.presence_of_element_located((By.XPATH, "//div[child::input[@type='text' and @placeholder='Search for area, street name..']]")))
    input_box = location_input_container.find_element(By.TAG_NAME, "input")
    input_box.clear()
    input_box.send_keys("concirus, 13/1, Block A, Industrial Area, Sector 62, Noida, Uttar Pradesh 201309, India")
    print(":white_check_mark: Entered address in location field.")
    time.sleep(3)
    first_suggestion = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//div[@class='_2RwM6']"))
    )
    first_suggestion.click()
    print(":white_check_mark: Clicked the first location suggestion.")
    time.sleep(3)
except Exception as e:
    print(":x: Failed to enter or select location:", e)

try:
    skip_button = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//a[.//div[text()='SKIP & ADD LATER']]"))
    )
    skip_button.click()
    print(":white_check_mark: Clicked 'Skip & Add Later' button.")
    time.sleep(3)
except:
    print(":warning: 'Skip & Add Later' button not found or already skipped.")

try:
    json_path = os.path.join(os.path.dirname(__file__), "temp_data.json")
    with open(json_path, "r") as file:
        food_data = json.load(file)

    food_name = food_data["name"]
    vote_count = int(food_data["voteCount"])
    restaurant_name = food_data["restaurantName"]
    food_name = food_name.split("/")[0].strip()
    print(f":white_check_mark: Loaded data: Restaurant = {restaurant_name}, Food = {food_name}, Votes = {vote_count}")
except Exception as e:
    print(":x: Failed to read food data:", e)
    driver.quit()
    exit()

try:
    search_icon = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Search']/ancestor::div[1]")))
    search_icon.click()
    print(":white_check_mark: Clicked on Search icon.")
    time.sleep(3)
except Exception as e:
    print(":x: Failed to click search icon:", e)

try:
    search_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Search for restaurants and food']")))
    search_input.send_keys(restaurant_name)
    print(f":mag: Searching for restaurant: {restaurant_name}")
    time.sleep(3)
except Exception as e:
    print(":x: Failed to enter restaurant name:", e)

try:
    restaurant_result = wait.until(EC.element_to_be_clickable((By.XPATH, f"//button[contains(normalize-space(.), '{restaurant_name}')]")))
    restaurant_result.click()
    print(f":white_check_mark: Opened restaurant: {restaurant_name}")
    time.sleep(3)
except Exception as e:
    print(":x: Could not find or open restaurant:", e)

try:
    particular_restaurant = wait.until(EC.presence_of_element_located((By.XPATH, "(//div[@data-testid='search-pl-restaurant-card'])[1]")))
    particular_restaurant.click()
    print(":white_check_mark: Restaurant landing page loaded.")
except:
    print(":warning: Couldn't confirm landing page, continuing anyway...")

try:
    menu_search = wait.until(EC.presence_of_element_located((By.XPATH, "//div[text()='Search for dishes']/parent::button")))
    menu_search.click()
    print(":white_check_mark: Clicked on Menu Search icon.")
    time.sleep(2)
except Exception as e:
    print(":x: Failed to click on Menu Search icon:", e)

try:
    menu_search_input = wait.until(EC.presence_of_element_located((By.XPATH, "//label[.//input[starts-with(@placeholder, 'Search in ')]]//input")))
    menu_search_input.send_keys(food_name)
    print(f":mag: Searched for food item: {food_name}")
    time.sleep(2)
except Exception as e:
    print(f":x: Failed to search for food item '{food_name}':", e)

try:
    food_cards = driver.find_elements(By.XPATH, "//div[@data-testid='normal-dish-item']")
    if not food_cards:
        print(f":x: Food item '{food_name}' not found in the menu.")
        driver.quit()
        exit()
    print(":white_check_mark: Found matching food item.")

    add_button = food_cards[0].find_element(By.XPATH, ".//button[.//div[contains(text(), 'Add')]][2]")
    add_button.click()
    print(":shopping_trolley: Clicked 'Add' on first food item.")
    time.sleep(2)

    start_afresh_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Yes, start afresh')]")
    if start_afresh_buttons:
        start_afresh_buttons[0].click()
        print(":white_check_mark: Clicked 'Start Afresh' button.")
        time.sleep(2)
    else:
        print(":warning: 'Start Afresh' button not found - proceeding to next step.")
except Exception as e:
    print(":x: Failed to click 'Add' on food item:", e)

try:
    while True:
        clicked_any = False
        try:
            continue_button = WebDriverWait(driver, 2).until(
                EC.element_to_be_clickable((By.XPATH, "//div//div//button[.//span[text()='Continue']]")))
            continue_button.click()
            print(":arrow_right: Clicked 'Continue' button.")
            clicked_any = True
            time.sleep(2)
        except:
            pass

        try:
            final_add_button = WebDriverWait(driver, 2).until(
                EC.element_to_be_clickable((By.XPATH, "//div//div//button[.//span[contains(text(), 'Add Item to cart')]]")))
            while True:
                final_add_button.click()
                print(":shopping_trolley: Clicked 'Add item to cart' button.")
                try:
                    toast = WebDriverWait(driver, 3).until(
                        EC.presence_of_element_located((By.XPATH, "//div[starts-with(text(), 'You must select')]"))
                    )
                    if toast.is_displayed():
                        print(":warning: 'Selection required' toast appeared. Waiting 10 seconds for user...")
                        time.sleep(10)
                        final_add_button = WebDriverWait(driver, 5).until(
                            EC.element_to_be_clickable((By.XPATH, "//div//div//button[.//span[contains(text(), 'Add Item to cart')]]"))
                        )
                        continue
                except:
                    print(":white_check_mark: No toast appeared. Proceeding...")
                    break
            break
        except:
            pass

        if not clicked_any:
            print(":x: Neither 'Continue' nor 'Add Item to cart' button found.")
            break
except Exception as e:
    print(":warning: Error while handling Continue/Add item flow:", e)

for i in range(vote_count - 1):
    try:
        time.sleep(1)
        plus_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[div[text()='+']]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", plus_button)
        plus_button.click()
        print(f":heavy_plus_sign: Clicked '+' for item {i + 2}")
        time.sleep(1)
        repeat_buttons = driver.find_elements(By.XPATH, "//button[.//span[contains(text(), 'Repeat')]]")
        if repeat_buttons:
            repeat_buttons[0].click()
            print(f":repeat: Clicked 'Repeat' for item {i + 2}")
            time.sleep(1)
        else:
            print(f":warning: No 'Repeat' button appeared at vote {i + 2}")
    except Exception as e:
        print(f":x: Failed during vote iteration {i + 2}: {e}")
        break

try:
    cart_button = wait.until(EC.presence_of_element_located((By.XPATH, "//span[text()='Cart']")))
    cart_button.click()
    print(":white_check_mark: Clicked on Cart icon.")
    time.sleep(2)
except Exception as e:
    print(":x: Failed to click on Cart icon:", e)

try:
    add_new_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(text(),'Add New') ]")))
    add_new_button.click()
    print(":white_check_mark: Clicked 'Add New' button to add address.")
    time.sleep(2)
except Exception as e:
    print(":x: Failed to click 'Add New' button:", e)

try:
    flat_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@name='building']")))
    flat_input.send_keys("Concirrus, 3rd floor, Tower-A, Graphix")
    print(":white_check_mark: Entered Door/Flat No.")
    time.sleep(1)
except Exception as e:
    print(":x: Failed to enter Door/Flat No:", e)

try:
    landmark_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@name='landmark']")))
    landmark_input.send_keys("Near Noida Electronic City Metro, Block A, Industrial Area, Sector 62, Noida")
    print(":white_check_mark: Entered Landmark.")
    time.sleep(1)
except Exception as e:
    print(":x: Failed to enter Landmark:", e)

try:
    save_proceed_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[text()='SAVE ADDRESS & PROCEED']")))
    save_proceed_button.click()
    print(":white_check_mark: Clicked 'Save Address & Proceed' button.")
    time.sleep(3)
except Exception as e:
    print(":x: Failed to click 'Save Address & Proceed':", e)

try:
    input("\nPress Enter when you want to close the browser (or just close it manually)...")
    driver.quit()
    print(":white_check_mark: Browser closed successfully!")
except KeyboardInterrupt:
    print("\n:red_circle: Script interrupted by user.")
    driver.quit()
except Exception as e:
    print(f":warning: Error during closing: {e}")
    try:
        driver.quit()
    except:
        pass
