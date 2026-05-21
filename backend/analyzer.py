import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

SYSTEM_PROMPT = """
You are the ContractIQ Senior Legal Counsel. Your mission is to perform a high-stakes, comprehensive risk audit of the provided contract.
Focus on identifying NOT just compliance issues, but deep-seated Legal, Financial, and Operational risks.

YOUR AUDIT MUST COVER:
1. FINANCIAL RISKS: Hidden liabilities, uncapped damages, punitive late fees, or vague payment triggers.
2. TERMINATION TRAPS: "Evergreen" clauses, lack of termination for convenience, or extreme exit penalties.
3. INTELLECTUAL PROPERTY: Overly broad IP assignments or lack of necessary usage licenses.
4. INDEMNIFICATION & LIABILITY: Unbalanced indemnification clauses or failure to limit consequential damages.
5. DISPUTE RESOLUTION: Dangerous choice of law or unfavorable arbitration venues.

Note on Examples: The provided one-shot example is for format, structure, tone, and severity calibration. You must perform the risk audit based on the specific type of contract provided (e.g., employment, NDA, loan, leasing, etc.), focusing on risks relevant to that contract's domain.

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

EXAMPLES = {
    "service": {
        "user": """Analyze this contract:

SERVICE AGREEMENT
Section 4. Payment. Client shall pay all invoices within 10 days of receipt. Any late payment shall accrue interest at a rate of 5% per month.
Section 9. Limitation of Liability. Contractor's total liability under this agreement is uncapped. Client agrees to indemnify Contractor for all third-party claims.
Section 12. Intellectual Property. All work product and deliverables created under this agreement shall be the sole and exclusive property of the Contractor. Client is granted a non-exclusive license to use the deliverables solely during the term of this agreement.""",
        "assistant": """{
  "risk_score": 75,
  "summary": "This contract contains a highly unfavorable IP assignment, uncapped liability for the Contractor, and extremely high late payment interest fees.",
  "risk_level": "High",
  "clauses": [
    {
      "title": "Punitive Late Payment Interest",
      "original_text": "Any late payment shall accrue interest at a rate of 5% per month.",
      "risk_score": 60,
      "severity": "Medium",
      "explanation": "An interest rate of 5% per month (60% per annum) is exceptionally high and could be deemed legally unenforceable (usurious) depending on the jurisdiction, representing a significant financial risk.",
      "suggested_change": "Any late payment shall accrue interest at a rate of 1.5% per month or the maximum rate permitted by law, whichever is lower."
    },
    {
      "title": "Unbalanced Limitation of Liability & Indemnification",
      "original_text": "Contractor's total liability under this agreement is uncapped. Client agrees to indemnify Contractor for all third-party claims.",
      "risk_score": 85,
      "severity": "High",
      "explanation": "Leaving the Contractor's liability completely uncapped while forcing the Client to indemnify the Contractor for all third-party claims exposes the Client to infinite legal and financial liability.",
      "suggested_change": "Except for indemnification obligations and breaches of confidentiality, either party's total liability shall be capped at the total amount paid under this agreement in the 12 months preceding the claim."
    },
    {
      "title": "Unfavorable Intellectual Property Ownership",
      "original_text": "All work product and deliverables created under this agreement shall be the sole and exclusive property of the Contractor. Client is granted a non-exclusive license to use the deliverables solely during the term of this agreement.",
      "risk_score": 80,
      "severity": "High",
      "explanation": "The Client is paying for the work, but does not own the intellectual property. Furthermore, the license to use the deliverables expires at the end of the agreement, meaning the Client cannot use the work product post-termination.",
      "suggested_change": "Upon full payment, all work product and deliverables created specifically for the Client under this agreement shall be owned by the Client, and the Contractor shall retain ownership of its pre-existing materials with a perpetual, royalty-free license granted to the Client."
    }
  ],
  "overall_recommendation": "Negotiate to cap the liability of both parties, reduce the late fee interest, and secure ownership or a perpetual post-termination license for the deliverables."
}"""
    },
    "employment": {
        "user": """Analyze this contract:

EMPLOYMENT AGREEMENT
Section 3. Non-Compete. Employee agrees that for 3 years post-employment, they will not work for any company in the software industry globally.
Section 7. Invention Assignment. Employee assigns all rights to all inventions, ideas, and software created by Employee during the period of employment, whether at work or in their own free time using their own equipment.
Section 10. Termination. Company may terminate Employee immediately for any reason without notice or severance.""",
        "assistant": """{
  "risk_score": 85,
  "summary": "The agreement includes an unenforceable global non-compete, an overly broad invention assignment covering personal time/projects, and a termination clause that lacks statutory notice or severance.",
  "risk_level": "Critical",
  "clauses": [
    {
      "title": "Overly Broad Global Non-Compete",
      "original_text": "Employee agrees that for 3 years post-employment, they will not work for any company in the software industry globally.",
      "risk_score": 85,
      "severity": "High",
      "explanation": "A 3-year global non-compete for any software company is extremely restrictive and likely legally unenforceable under many state laws (e.g., California/New York) for lack of reasonable geographic and temporal scope.",
      "suggested_change": "Employee agrees that for a period of one (1) year following termination, they will not engage in a competing business within a 25-mile radius of the Company's headquarters."
    },
    {
      "title": "All-Encompassing Intellectual Property Assignment",
      "original_text": "Employee assigns all rights to all inventions, ideas, and software created by Employee during the period of employment, whether at work or in their own free time using their own equipment.",
      "risk_score": 90,
      "severity": "High",
      "explanation": "Assigning IP created on personal time, using personal equipment, and unrelated to the company's business is overly broad and infringes on the employee's personal creative rights.",
      "suggested_change": "Employee assigns all rights to inventions, ideas, and software created during employment that are directly related to the Company's business or developed using Company resources/premises."
    },
    {
      "title": "No-Notice Termination Without Severance",
      "original_text": "Company may terminate Employee immediately for any reason without notice or severance.",
      "risk_score": 80,
      "severity": "High",
      "explanation": "Allows immediate termination without cause, without any notice period or severance pay, offering zero security to the employee.",
      "suggested_change": "The Company may terminate this Agreement without cause upon thirty (30) days' written notice, or immediately by paying thirty (30) days of base salary as severance."
    }
  ],
  "overall_recommendation": "Redline the non-compete to a local/reasonable scope, restrict the IP assignment to company-related work, and negotiate a standard 30-day notice or severance period for termination without cause."
}"""
    },
    "nda": {
        "user": """Analyze this contract:

MUTUAL NON-DISCLOSURE AGREEMENT
1. Definition. Confidential Information means any information disclosed by Disclosing Party.
2. Term. The obligations under this Agreement shall continue indefinitely from the date of disclosure.
3. Remedies. Receiving Party agrees that in the event of any breach, Disclosing Party shall be entitled to liquidated damages of $500,000 without proof of actual damage.""",
        "assistant": """{
  "risk_score": 80,
  "summary": "This NDA contains highly problematic terms, including an indefinite duration of confidentiality obligations and an extreme liquidated damages clause.",
  "risk_level": "High",
  "clauses": [
    {
      "title": "Indefinite Confidentiality Term",
      "original_text": "The obligations under this Agreement shall continue indefinitely from the date of disclosure.",
      "risk_score": 70,
      "severity": "Medium",
      "explanation": "Confidentiality obligations should ideally have a defined survival period (e.g., 2-5 years). Indefinite obligations create long-term compliance overhead and liability exposure.",
      "suggested_change": "The obligations of confidentiality under this Agreement shall survive for a period of three (3) years from the date of disclosure."
    },
    {
      "title": "Exorbitant Liquidated Damages",
      "original_text": "Receiving Party agrees that in the event of any breach, Disclosing Party shall be entitled to liquidated damages of $500,000 without proof of actual damage.",
      "risk_score": 90,
      "severity": "High",
      "explanation": "A pre-agreed $500,000 penalty for any breach, regardless of scale or actual harm, is punitive and could lead to financial ruin over minor accidental disclosures.",
      "suggested_change": "In the event of a breach, the disclosing party shall be entitled to seek actual proven damages and equitable relief, including injunctive relief, from a court of competent jurisdiction."
    }
  ],
  "overall_recommendation": "Negotiate a reasonable term limits for confidentiality (e.g., 3 years) and completely remove the liquidated damages clause in favor of standard actual damages."
}"""
    },
    "banking": {
        "user": """Analyze this contract:

CREDIT AND LOAN AGREEMENT
Section 2. Interest. The Lender reserves the right to increase the interest rate by up to 10% per annum at its sole discretion upon 24 hours' notice.
Section 8. Acceleration. Lender may declare the entire outstanding loan balance immediately due and payable if Lender, in its sole subjective opinion, deems itself insecure.
Section 14. Collateral. Lender is granted a security interest in all current and future assets of the Borrower, including personal personal property, bank accounts, and intellectual property.""",
        "assistant": """{
  "risk_score": 90,
  "summary": "This loan agreement gives the lender extreme power, including discretionary interest rate hikes, subjective acceleration of debt, and a sweeping security interest over all business assets.",
  "risk_level": "Critical",
  "clauses": [
    {
      "title": "Discretionary Interest Rate Hikes",
      "original_text": "The Lender reserves the right to increase the interest rate by up to 10% per annum at its sole discretion upon 24 hours' notice.",
      "risk_score": 85,
      "severity": "High",
      "explanation": "Discretionary rate hikes with virtually no notice expose the borrower to unpredictable and potentially unsustainable interest expenses.",
      "suggested_change": "The interest rate shall remain fixed, or adjust solely in accordance with fluctuations in the Federal Funds Rate or SOFR plus a pre-defined margin."
    },
    {
      "title": "Subjective Debt Acceleration ('Insecurity' Clause)",
      "original_text": "Lender may declare the entire outstanding loan balance immediately due and payable if Lender, in its sole subjective opinion, deems itself insecure.",
      "risk_score": 95,
      "severity": "High",
      "explanation": "An 'insecurity' clause allows the lender to demand immediate repayment based entirely on subjective feelings, without any actual default event (like missed payments), which is extremely risky.",
      "suggested_change": "Lender may only declare the outstanding loan balance due and payable upon the occurrence of a defined Event of Default (e.g., failure to pay after a 10-day cure period)."
    },
    {
      "title": "Overly Broad Collateral Grab",
      "original_text": "Lender is granted a security interest in all current and future assets of the Borrower, including personal personal property, bank accounts, and intellectual property.",
      "risk_score": 80,
      "severity": "Medium",
      "explanation": "Pledging all assets—especially intellectual property and essential bank accounts—as collateral severely limits the borrower's operational freedom and future refinancing options.",
      "suggested_change": "The security interest shall be limited to the specific equipment purchased with the loan proceeds, excluding intellectual property and operating bank accounts."
    }
  ],
  "overall_recommendation": "Strongly negotiate to remove the subjective 'insecurity' clause, link interest adjustments to an objective index (like SOFR), and limit the scope of collateral to specific financed assets."
}"""
    }
}

def classify_contract(text: str) -> str:
    text_lower = text.lower()
    if any(k in text_lower for k in ["employment", "job offer", "employee", "salary", "employer", "non-compete"]):
        return "employment"
    elif any(k in text_lower for k in ["non-disclosure", "nda", "confidentiality agreement", "confidential information"]):
        return "nda"
    elif any(k in text_lower for k in ["loan", "banking", "borrower", "lender", "credit agreement", "interest rate", "collateral"]):
        return "banking"
    return "service"

def analyze_with_groq(text):
    if not GROQ_API_KEY:
        return {"error": "GROQ_API_KEY not found in .env"}
        
    client = Groq(api_key=GROQ_API_KEY)
    
    category = classify_contract(text)
    example = EXAMPLES.get(category, EXAMPLES["service"])
    print(f"Classified contract as '{category}'. Sending request to Groq (Llama 3.3 70B)...")
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": example["user"]},
                {"role": "assistant", "content": example["assistant"]},
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
