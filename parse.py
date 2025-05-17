# First install required libraries
# pip install requests beautifulsoup4

import requests
from bs4 import BeautifulSoup

# Define the URL you want to scrape
url = 'https://example.com'

try:
    # Send a GET request to the website
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    response = requests.get(url, headers=headers)
    
    # Check if the request was successful
    response.raise_for_status()

    print('Response:')
    print(response.text[:500])  # Print the first 500 characters of the response
    
    # Parse the HTML content using Beautiful Soup
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Example: Extract and print the page title
    title = soup.title.text
    print(f'Page Title: {title}')
    
    # Example: Extract all paragraphs and print their text
    print('\nParagraphs:')
    for paragraph in soup.find_all('p'):
        print(paragraph.text)
    
    # Example: Extract all links
    print('\nLinks:')
    for link in soup.find_all('a'):
        print(link.get('href'))
        
except requests.exceptions.RequestException as e:
    print(f'Error fetching the page: {e}')
except Exception as e:
    print(f'An error occurred: {e}')