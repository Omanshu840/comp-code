import json
import os
import re
from bs4 import BeautifulSoup

BASE_DIR = 'content'

def clean_nextjs_html(raw_html):
    """Decodes escaped JSON, stitches NextJS chunks, and strips script tags."""
    if not raw_html:
        return ""
    
    try:
        decoded = raw_html.encode('utf-8').decode('unicode_escape', errors='replace')
    except Exception:
        decoded = raw_html

    decoded = re.sub(r'"]\)</script>\s*<script>self\.__next_f\.push\(\[1,"', '', decoded)
    decoded = re.sub(r'<script>self\.__next_f\.push\(\[\d+,"', '', decoded)
    decoded = decoded.replace('"])</script>', '')
    
    return decoded

def parse_complexities(text):
    """Extracts Time and Space complexity."""
    time_comp = "N/A"
    space_comp = "N/A"
    
    time_match = re.search(r'Time Complexity:\s*(.*?)(?=Space\s*Complexity:|$)', text, re.IGNORECASE | re.DOTALL)
    space_match = re.search(r'Space Complexity:\s*(.*)', text, re.IGNORECASE | re.DOTALL)
    
    if time_match:
        time_comp = time_match.group(1).strip()
    if space_match:
        space_comp = space_match.group(1).strip()
        
    return {"time": time_comp, "space": space_comp}

def process_problem_data(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    meta = data.get("metadata", {})
    raw_html = data.get("extracted_html", "")
    
    clean_html = clean_nextjs_html(raw_html)
    soup = BeautifulSoup(clean_html, 'html.parser')
    
    # --- 1. Prepare Metadata Dictionary ---
    metadata_dict = {
        "id": meta.get("problem_id", ""),
        "title": meta.get("problem_name", ""),
        "difficulty": meta.get("difficulty", "")
    }
    
    # --- 2. Prepare Problem Dictionary ---
    problem_dict = {
        "problem_statement": "",
        "examples": []
    }
    
    ps_strong = soup.find('strong', string=re.compile("Problem Statement", re.IGNORECASE))
    if ps_strong and ps_strong.parent:
        text = ps_strong.parent.text
        problem_dict["problem_statement"] = re.sub(r'(?i)Problem Statement\s*:\s*', '', text).strip()
        
    # --- UPGRADED ROBUST EXAMPLES PARSING ---
    example_div = soup.find(id="article_examples")
    if example_div:
        raw_text = example_div.get_text(separator='\n')
        
        # Split by "Input:" OR "Input Format:" 
        input_splits = re.split(r'(?i)Input(?: Format)?\s*:', raw_text)
        
        for chunk in input_splits[1:]:
            # Split by "Output:" OR "Result:"
            out_split = re.split(r'(?i)(?:Output|Result)\s*:', chunk)
            
            if len(out_split) > 1:
                # Clean up the input text (removing "Example 1:" prefixes if they exist)
                inp_text = re.sub(r'(?i)Example\s*\d+\s*:\s*', '', out_split[0]).strip()
                
                # Split by "Explanation:"
                exp_split = re.split(r'(?i)Explanation\s*:', out_split[1])
                out_text = exp_split[0].strip()
                exp_text = exp_split[1].strip() if len(exp_split) > 1 else ""
                
                problem_dict["examples"].append({
                    "input": inp_text,
                    "output": out_text,
                    "explanation": exp_text
                })

    # --- 3. Prepare Approaches Dictionary ---
    approaches_list = []
    approaches_container = soup.find('div', class_=re.compile("dsa_article_dropdown_approachs"))
    
    if approaches_container:
        approach_details = approaches_container.find_all('details')
        
        for details in approach_details:
            appr = {
                "name": "",
                "intuition_and_algorithm": "",
                "images": [],
                "complexities": {},
                "code": {}
            }
            
            summary = details.find('summary', class_='main-summary')
            if not summary:
                continue
                
            if summary.find('span'):
                appr["name"] = summary.find('span').text.strip()
                
            algo_div = details.find('div', class_='approach-algorithm')
            if algo_div:
                appr["intuition_and_algorithm"] = algo_div.text.strip()
                
                carousel = algo_div.find('div', class_=re.compile(r'image-carousel-container'))
                if carousel:
                    imgs = carousel.find_all('img')
                    for img in imgs:
                        src = img.get('src')
                        if src and src not in appr["images"]:
                            appr["images"].append(src)
                
            code_blocks = details.find_all('div', class_='code-block')
            for cb in code_blocks:
                lang = cb.get('data-lang', 'unknown')
                code_element = cb.find('code')
                if code_element:
                    appr["code"][lang] = code_element.text.strip()
                    
            complexity_summary = details.find(string=re.compile("Complexity Analysis", re.IGNORECASE))
            if complexity_summary:
                comp_details = complexity_summary.find_parent('details')
                if comp_details:
                    comp_text = comp_details.get_text(separator=' ')
                    appr["complexities"] = parse_complexities(comp_text)
                    
            if appr["name"]: 
                approaches_list.append(appr)

    return metadata_dict, problem_dict, approaches_list

def main():
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            if file == 'data.json':
                full_path = os.path.join(root, file)
                print(f"Processing: {full_path}")
                
                try:
                    metadata, problem, approaches = process_problem_data(full_path)
                    
                    with open(os.path.join(root, 'metadata.json'), 'w', encoding='utf-8') as f:
                        json.dump(metadata, f, indent=4, ensure_ascii=False)
                        
                    with open(os.path.join(root, 'problem.json'), 'w', encoding='utf-8') as f:
                        json.dump(problem, f, indent=4, ensure_ascii=False)
                        
                    with open(os.path.join(root, 'approaches.json'), 'w', encoding='utf-8') as f:
                        json.dump(approaches, f, indent=4, ensure_ascii=False)
                        
                    print(f" -> Success! Created metadata.json, problem.json, and approaches.json")
                except Exception as e:
                    print(f" -> Error processing {full_path}: {e}")

if __name__ == "__main__":
    main()