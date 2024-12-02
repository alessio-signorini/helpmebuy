#!/usr/bin/env python3
import argparse
import os
import requests
import re
from serpapi import GoogleSearch
import json

def sanitize_filename(filename):
    """Remove invalid characters from filename and convert spaces to underscores"""
    # First remove invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # Replace spaces and multiple underscores with a single underscore
    filename = re.sub(r'[\s_]+', '_', filename)
    # Convert to lowercase for consistency
    return filename

def download_first_google_image(query, save_dir):
    """
    Search Google Images for query and download the first image
    
    Args:
        query (str): Search query
        save_dir (str): Directory where to save the image
    """
    try:
        # Get your API key from environment variable
        api_key = os.getenv('SERPAPI_KEY')
        if not api_key:
            raise Exception("Please set SERPAPI_KEY environment variable")

        # Set up the search parameters
        params = {
            "engine": "google",
            "q": query,
            "tbm": "isch",  # For images
            "api_key": api_key
        }
        
        # Perform the search
        search = GoogleSearch(params)
        results = search.get_dict()
        
        # Get the first image URL
        if "images_results" not in results or len(results["images_results"]) == 0:
            raise Exception("No images found")
            
        img_url = results["images_results"][0]["original"]
        
        # Download the image
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        
        img_response = requests.get(img_url, headers=headers)
        img_response.raise_for_status()
        
        # Create directory if it doesn't exist
        os.makedirs(save_dir, exist_ok=True)
        
        # Create filename from sanitized query
        filename = sanitize_filename(query) + '.jpg'
        save_path = os.path.join(save_dir, filename)
        
        # Save the image
        with open(save_path, 'wb') as f:
            f.write(img_response.content)
            
        print(f"Successfully downloaded image to {save_path}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return False
        
    return True

def main():
    parser = argparse.ArgumentParser(description='Download first Google Images result')
    parser.add_argument('query', help='Search query')
    parser.add_argument('path', help='Directory where to save the image')
    
    args = parser.parse_args()
    
    # The path argument is now treated as the directory to save to
    download_first_google_image(args.query, args.path)

if __name__ == "__main__":
    main()
