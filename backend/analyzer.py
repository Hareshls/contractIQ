import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

SYSTEM_PROMPT = """
You are the LexGuard AI Senior Legal Counsel. Your mission is to perform a high-stakes, comprehensive risk audit of the provided contract.
Focus on identifying NOT just compliance issues, but deep-seated Legal, Financial, and Operational risks.

YOUR AUDIT MUST COVER:
1. FINANCIAL RISKS: Hidden liabilities, uncapped damages, punitive late fees, or vague payment triggers.
2. TERMINATION TRAPS: "Evergreen" clauses, lack of termination for convenience, or extreme exit penalties.
3. INTELLECTUAL PROPERTY: Overly broad IP assignments or lack of necessary usage licenses.
4. INDEMNIFICATION & LIABILITY: Unbalanced indemnification clauses or failure to limit consequential damages.
5. DISPUTE RESOLUTION: Dangerous choice of law or unfavorable arbitration venues.

YOU MUST RETURN THE RESPONSE IN THE FOLLOWING STRICT JSON FORMAT:
{
  "risk_score": number (0-100, where 100 is maximum risk),
  "summary": "A high-level executive summary of the most dangerous exposure points.",
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "clauses": [
    {
      "title": "Clear name of the dangerous clause",
      "original_text": "Exact snippet from the contract",
      "risk_score": number (0-100),
      "severity": "Low" | "Medium" | "High",
      "explanation": "Detailed legal and financial reasoning for why this is a risk.",
      "suggested_change": "Specific redlined recommendation to mitigate this risk."
    }
  ],
  "overall_recommendation": "Strategic advice for the negotiator."
}
"""

def analyze_with_groq(text):
    if not GROQ_API_KEY:
        return {"error": "GROQ_API_KEY not found in .env"}
        
    client = Groq(api_key=GROQ_API_KEY)
    print("Sending request to Groq (Llama 3.3 70B)...")
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze this contract:\n\n{text}"}
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        response_content = chat_completion.choices[0].message.content
        return json.loads(response_content)
    except Exception as e:
        print(f"Groq API Error: {e}")
        return {"error": f"AI analysis failed: {str(e)}"}

def analyze_contract(contract_text):
    # Ensure text isn't too large for the context window
    if len(contract_text) > 40000:
        contract_text = contract_text[:40000] + "... [Text truncated]"
        
    return analyze_with_groq(contract_text)
