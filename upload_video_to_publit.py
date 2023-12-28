# The objective of this script is to upload a video to a specific link, making it accessible to everyone on the internet.
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import os
from dotenv import load_dotenv

load_dotenv()

file_name = os.getenv('FILENAME')  # Replace this with your file path
file_path = os.path.abspath(file_name)

driver = webdriver.Firefox()
driver.get("https://publit.io/login")


# Increase the new window size to make cookie div relatively smaller
current_width = driver.execute_script("return window.innerWidth;")
current_height = driver.execute_script("return window.innerHeight;")
new_width = int(current_width * 1.2)
new_height = int(current_height * 1.2)
driver.set_window_size(new_width, new_height)


# Login
# Replace these with your actual credentials
username = os.getenv('LOGIN')
password = os.getenv('PASSWORD')
username_input = driver.find_element("id", "email")
username_input.send_keys(username)
password_input = driver.find_element("id", "password")
password_input.send_keys(password)
password_input.send_keys(Keys.RETURN)
time.sleep(5)  # Let the login process complete

# Navigate to the desired page
driver.get("https://publit.io/dashboard/files")
time.sleep(5)

webEle = driver.find_element(By.XPATH, "//input[@type='file']")
webEle.send_keys(file_path)  # Sending our file to the specified input

upload_button = driver.find_element(By.ID, "start-upload-button")
add_button = driver.find_element(By.ID, "add-upload-button")

upload_button.click()


end_time = time.time() + 600  # Waiting up to 10 minutes for the upload
while time.time() < end_time:
    add_button = driver.find_elements(By.ID, "add-upload-button")
    if add_button:
        time.sleep(5)  # Wait for 5 seconds before checking again
    else:
        break  # Elements found, break out of the loop


elements_with_tooltip = driver.find_elements(By.XPATH, "//span[@class='fileIconsContainer has-tooltip']")
elements_with_tooltip[1].click()  # Clicking here opens a new tab with the URI of our file
time.sleep(2)
new_window_handle = driver.window_handles[1]
driver.switch_to.window(new_window_handle)
time.sleep(5)

# HERE WE GOOO THE URL
precious_uri = driver.current_url
print("URI: ", precious_uri)

time.sleep(5)

driver.quit()