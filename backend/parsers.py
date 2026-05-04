import pdfplumber
from docx import Document
import io

def parse_pdf(file_bytes):
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def parse_docx(file_bytes):
    doc = Document(io.BytesIO(file_bytes))
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def parse_txt(file_bytes):
    return file_bytes.decode("utf-8")
