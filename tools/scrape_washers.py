import requests
import json
import random
import time
from bs4 import BeautifulSoup

def scrape_washers():
    url = "https://www.homedepot.com/b/Appliances-Washers-Dryers-Washing-Machines/N-5yc1vZc3ov"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        products = []
        product_cards = soup.find_all('div', class_='product-pod')
        
        for card in product_cards[:30]:  # Get first 30 washers
            try:
                name = card.find('span', class_='product-title__title').text.strip()
                brand = name.split()[0]
                model = card.find('span', class_='product-identifier__value').text.strip()
                price_elem = card.find('span', class_='price-format__main-price')
                price = float(price_elem.text.replace('$', '').replace(',', '')) if price_elem else 999.99
                
                # Extract features from description
                features = []
                desc = card.find('div', class_='product-pod__description')
                if desc:
                    features = [feat.strip() for feat in desc.text.split('•') if feat.strip()]
                
                # Determine attributes based on name and features
                attributes = {
                    "type": "front" if "Front Load" in name else "top",
                    "size": "large" if any(s in name.lower() for s in ["5.0", "4.8", "4.5"]) else "medium",
                    "smart": any(["Smart" in name, "WiFi" in name, "Connected" in name]),
                    "efficiency": "high" if "High-Efficiency" in name else "standard"
                }
                
                product = {
                    "id": str(len(products) + 1),
                    "brand": brand,
                    "model": model,
                    "name": name,
                    "price": price,
                    "features": features[:3],  # Keep top 3 features
                    "attributes": attributes
                }
                products.append(product)
                
            except Exception as e:
                print(f"Error processing product: {e}")
                continue
                
        return products
        
    except Exception as e:
        print(f"Error scraping washers: {e}")
        return []

def update_products_json():
    # Read existing products
    with open('data/washer/products.json', 'r') as f:
        data = json.load(f)
    
    # Get new products
    new_products = scrape_washers()
    
    # Update IDs for new products
    start_id = len(data['products']) + 1
    for i, product in enumerate(new_products):
        product['id'] = str(start_id + i)
    
    # Add new products
    data['products'].extend(new_products)
    
    # Write updated data
    with open('data/washer/products.json', 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    update_products_json()
