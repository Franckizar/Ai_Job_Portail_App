import requests
from bs4 import BeautifulSoup
import json
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

BASE_URL = 'https://www.emploi.cm'
SEARCH_URL = f'{BASE_URL}/recherche-jobs-cameroun'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
}

def get_total_pages(soup):
    pagination = soup.select_one('.pagination')
    if not pagination:
        return 1
    pages = pagination.select('li a')
    page_numbers = [int(a.text) for a in pages if a.text.isdigit()]
    return max(page_numbers) if page_numbers else 1

def extract_jobs(soup):
    job_list = []
    wrapper = soup.select_one('.page-search-jobs-wrapper')
    if not wrapper:
        logging.warning("⚠️ Wrapper not found")
        return []

    for card in wrapper.select('.card.card-job'):
        try:
            title_tag = card.select_one('h3 > a')
            company_tag = card.select_one('.card-job-company')
            time_tag = card.select_one('time')
            detail_list = card.select('ul li')

            # Extract location from list items
            location = ''
            for li in detail_list:
                if 'Région de' in li.text:
                    location = li.get_text(strip=True).replace('Région de :', '').strip()
                    break

            job = {
                'title': title_tag.get_text(strip=True) if title_tag else None,
                'company': company_tag.get_text(strip=True) if company_tag else None,
                'location': location,
                'date': time_tag['datetime'] if time_tag else None,
                'link': BASE_URL + title_tag['href'] if title_tag else None,
            }
            job_list.append(job)
        except Exception as e:
            logging.error(f"Error parsing job card: {e}")
    return job_list

def scrape_all_jobs():
    all_jobs = []
    session = requests.Session()
    session.headers.update(HEADERS)

    logging.info("Fetching first page to detect pagination...")
    response = session.get(SEARCH_URL, timeout=50)
    soup = BeautifulSoup(response.text, 'html.parser')
    total_pages = get_total_pages(soup)

    logging.info(f"Detected total pages: {total_pages}")
    for page in range(1, total_pages + 1):
        page_url = f"{SEARCH_URL}?page={page}"
        logging.info(f"Scraping page {page}: {page_url}")
        try:
            resp = session.get(page_url, timeout=10)
            page_soup = BeautifulSoup(resp.text, 'html.parser')
            jobs = extract_jobs(page_soup)
            all_jobs.extend(jobs)
        except Exception as e:
            logging.error(f"Failed to scrape page {page}: {e}")

    return all_jobs

def save_jobs(jobs):
    if not jobs:
        logging.warning("⚠️ No jobs to save")
        return

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"emploi_cm_jobs_{timestamp}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(jobs, f, ensure_ascii=False, indent=4)
    logging.info(f"✅ Saved {len(jobs)} jobs to {filename}")

if __name__ == '__main__':
    jobs = scrape_all_jobs()
    save_jobs(jobs)
