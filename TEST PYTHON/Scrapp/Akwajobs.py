import requests
from bs4 import BeautifulSoup
import logging
import time

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

BASE_URL = "http://www.akwajobs.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

def get_total_pages():
    """Fetch the number of pages from the pagination element"""
    response = requests.get(BASE_URL, headers=HEADERS)
    soup = BeautifulSoup(response.text, 'html.parser')
    pagination = soup.find("ul", class_="pagination")
    if pagination:
        page_links = pagination.find_all("a")
        numbers = [int(a.text.strip()) for a in page_links if a.text.strip().isdigit()]
        return max(numbers) if numbers else 1
    return 1

def extract_jobs_from_page(page_url):
    """Extract job data from a single page"""
    jobs = []

    try:
        response = requests.get(page_url, headers=HEADERS)
        soup = BeautifulSoup(response.text, 'html.parser')
        contents = soup.find_all("div", class_="content-left")

        for block in contents:
            job_data = {}
            media = block.find("div", class_="media-body")
            if not media:
                continue

            # Date
            date = media.find("p")
            job_data["date"] = date.text.strip() if date else ""

            # Title & Link
            title_tag = media.find("h3", class_="media-heading")
            if title_tag and title_tag.a:
                job_data["title"] = title_tag.a.text.strip()
                job_data["link"] = title_tag.a["href"]
            else:
                job_data["title"] = ""
                job_data["link"] = ""

            # Company
            company = media.find("h4")
            job_data["company"] = company.text.strip() if company else ""

            # Category & Location
            h5 = media.find("h5")
            if h5:
                parts = h5.find_all("a")
                job_data["category"] = parts[0].text.strip() if len(parts) > 0 else ""
                job_data["location"] = parts[1].text.strip() if len(parts) > 1 else ""
            else:
                job_data["category"] = ""
                job_data["location"] = ""

            jobs.append(job_data)

    except Exception as e:
        logging.warning(f"Failed to extract page: {page_url} due to {e}")
    
    return jobs

def scrape_all_jobs():
    total_pages = get_total_pages()
    logging.info(f"Detected total pages: {total_pages}")
    all_jobs = []

    for page in range(1, total_pages + 1):
        page_url = f"{BASE_URL}?page={page}"
        logging.info(f"Scraping page {page} of {total_pages}: {page_url}")
        jobs = extract_jobs_from_page(page_url)
        all_jobs.extend(jobs)

        # Polite delay to avoid overloading server
        time.sleep(1)
    
    return all_jobs

if __name__ == "__main__":
    all_jobs = scrape_all_jobs()

    # Preview output
    for job in all_jobs[:5]:
        print(job)

    # Optionally save to JSON
    import json
    with open("akwajobs_all_jobs.json", "w", encoding="utf-8") as f:
        json.dump(all_jobs, f, ensure_ascii=False, indent=2)

    logging.info(f"Saved {len(all_jobs)} jobs to akwajobs_all_jobs.json")
