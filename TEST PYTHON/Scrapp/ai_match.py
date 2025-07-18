import json
import requests
from flask import Flask, request, jsonify

# ---- Configuration ----
AI_CONFIG = {
    "url": "http://localhost:11434/api/generate",
    "model": "Models"    # <-- Change to your actual Ollama model
}
DATA_FILENAME = "emploi_cm_jobs_20250717_030659.json"

with open(DATA_FILENAME, "r", encoding="utf-8") as f:
    jobs = json.load(f)

app = Flask(__name__)

def build_prompt(cv, job):
    return f"""Evaluate how well this CV matches the following job offer. Return only a score (float) between 0 (no match) and 1 (perfect match).

CV:
{cv}

Job Offer:
Title: {job['title']}
Company: {job['company']}
Location: {job['location']}
Link: {job['link']}

Score:
"""

def get_ollama_score(cv_text, job, ai_config):
    prompt = build_prompt(cv_text, job)
    body = {
        "model": ai_config["model"],
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(ai_config["url"], json=body)
    response.raise_for_status()
    raw = response.json()["response"].strip()
    try:
        score = float(next(filter(lambda s: s.replace('.', '', 1).isdigit(), raw.split())))
    except Exception:
        try:
            score = float(raw)
        except Exception:
            score = None
    return score

@app.route('/match-cv', methods=['POST'])
def match_cv():
    """
    Expects JSON: { "resume": "string..." }
    Returns: JSON with job list and match scores
    """
    data = request.get_json()
    resume = data.get("resume", "").strip()
    if not resume:
        return jsonify({"error": "No resume provided"}), 400

    results = []
    for idx, job in enumerate(jobs[:3], start=1):
        try:
            score = get_ollama_score(resume, job, AI_CONFIG)
        except Exception as err:
            score = None
        results.append({
            "job_title": job['title'],
            "company": job['company'],
            "location": job['location'],
            "link": job['link'],
            "score": score
        })
    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
