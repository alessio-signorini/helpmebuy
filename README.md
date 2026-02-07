# 🛍️ HelpMeBuy

An Apple-inspired web application to help users find their perfect washing machine. The interface guides users through simple questions to recommend the best washing machine for their needs.

## Features
- Clean, minimalist design
- Progressive visualization
- Smart recommendation engine
- Mobile-friendly interface
- Easy deployment to GitHub Pages

## Local Development
1. Clone this repository
2. Navigate to the project directory in terminal:
   ```bash
   cd /path/to/washing-machine-selector
   ```
3. Start a local server:
   ```bash
   # If you have Python 3:
   python3 -m http.server 8000
   
   # If you have Python 2:
   python -m SimpleHTTPServer 8000
   ```
4. Open your browser and visit:
   ```
   http://localhost:8000
   ```

## Deployment
The site is ready for GitHub Pages deployment. Just:
1. Push to your GitHub repository
2. Enable GitHub Pages in your repository settings
3. Select the main branch as source

## Data Updates
Product data and questions can be updated by modifying the JSON files in the `data` directory.

## Structure
- `index.html` - Main entry point
- `css/` - Styling files
- `js/` - Application logic
- `data/` - Product and question data
- `images/` - Product images and sketches
