import json
import os
import re
import time
import requests
from bs4 import BeautifulSoup

# File paths
INPUT_JSON_FILE = 'output/roadmap.json' # The JSON structure you showed above
BASE_OUTPUT_DIR = 'TakeUForward_Content'

# Headers to simulate a real browser request and prevent 403 Forbidden errors
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def sanitize_filename(name):
    """Removes invalid characters for folder/file names."""
    if not name:
        return "Unknown"
    # Remove characters not allowed in Windows/Mac/Linux paths
    return re.sub(r'[\\/*?:"<>|]', "", str(name)).strip()

def fetch_article_content(url):
    """Fetches the URL and extracts the main article content."""
    if not url or url == "$undefined" or not url.startswith("http"):
        return None
    
    try:
        print(f"  -> Fetching: {url}")
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # TakeUForward and many blogs usually keep content in specific tags.
        # We try to find the main article container, falling back to body if not found.
        content_div = soup.find('div', class_='entry-content') or \
                      soup.find('main') or \
                      soup.find('article')
                      
        if content_div:
            # Return the raw HTML of the content section
            return str(content_div)
        else:
            # Fallback: Just return the whole body if specific wrappers aren't found
            return str(soup.body)
            
    except Exception as e:
        print(f"  -> Error fetching {url}: {e}")
        return None

def main():
    # 1. Load the structured JSON
    try:
        with open(INPUT_JSON_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: {INPUT_JSON_FILE} not found.")
        return

    # 2. Iterate through Categories -> Subcategories -> Problems
    for category in data:
        cat_name = sanitize_filename(category.get('category_name', 'Unnamed_Category'))
        
        for subcategory in category.get('subcategories', []):
            sub_name = sanitize_filename(subcategory.get('subcategory_name', 'Unnamed_Subcategory'))
            
            for problem in subcategory.get('problems', []):
                prob_name = sanitize_filename(problem.get('problem_name', 'Unnamed_Problem'))
                
                # 3. Create the folder structure
                folder_path = os.path.join(BASE_OUTPUT_DIR, cat_name, sub_name, prob_name)
                os.makedirs(folder_path, exist_ok=True)
                
                # 4. Fetch the article content
                article_url = problem.get('article')
                html_content = fetch_article_content(article_url)
                
                # 5. Prepare the final JSON structure for this specific problem
                output_data = {
                    "metadata": problem,
                    "extracted_html": html_content
                }
                
                # 6. Save the content to a JSON file inside the problem's folder
                output_file = os.path.join(folder_path, 'data.json')
                with open(output_file, 'w', encoding='utf-8') as out_f:
                    json.dump(output_data, out_f, indent=4, ensure_ascii=False)
                
                print(f"Saved: {folder_path}/data.json")
                
                # Sleep briefly to be polite to the server and avoid getting IP banned
                time.sleep(1)

if __name__ == "__main__":
    main()