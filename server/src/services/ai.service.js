const { GoogleGenAI } = require("@google/genai");
const { serverConfig } = require("../config");
const puppeteer = require("puppeteer");
const { StatusCodes } = require("http-status-codes");

const ai = new GoogleGenAI({ apiKey: serverConfig.GEMINI_API_KEY });

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an AI interview analysis system.

You MUST return ONLY valid JSON in the following exact structure:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": string[]
    }
  ],
  "title":string,
}

DO NOT return any field empty.
Do NOT wrap in markdown.
Return JSON only.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  try {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });


  return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating interview report:", error);
    error.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    error.message = "Failed to generate interview report! Try again later."; 
    throw error;  
  }
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePDF({ resume, selfDescription, jobDescription }) {
  const prompt = `
You are an expert resume writer with experience creating ATS-optimized resumes for technical roles.

Your task is to generate a professional, human-written resume tailored specifically to the given Job Description.

INPUT DATA:
Resume Data: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

INSTRUCTIONS:

1. Carefully analyze the Job Description and tailor the resume accordingly.
2. Emphasize relevant skills, projects, achievements, and experience that match the job requirements.
3. Use professional, natural, and human-like language. Avoid robotic or AI-like phrasing.
4. The resume must be concise and fit within 1–2 pages when converted to PDF.
5. Focus on measurable achievements where possible (use metrics if available).
6. Ensure the resume is ATS-friendly:
   - Use standard section headings (Summary, Skills, Experience, Projects, Education, Certifications, etc.)
   - Avoid tables, excessive styling, icons, or complex layouts.
   - Keep semantic and clean HTML structure.
7. Design should be simple, modern, and professional.
8. You may use subtle inline CSS styling (fonts, spacing, minimal color accents), but keep it clean and print-friendly.
9. Do NOT add any explanations or commentary outside the required JSON output.
10. Do NOT include markdown formatting.
11. Do NOT include backticks.

OUTPUT FORMAT (STRICTLY FOLLOW):

Return ONLY a valid JSON object with this exact structure:

{
  "html": "<!DOCTYPE html> ... complete resume HTML here ..."
}

The value of "html" must contain a fully structured, self-contained HTML document that can be directly rendered or converted to PDF using Puppeteer.
`;

  try {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  
});

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
  } catch (error) {
    console.error("Error generating resume PDF:", error.error.message);
    error.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    error.message = "Failed to generate interview report! Try again later."; 
    throw error; 
  }
}

module.exports = {
  generateInterviewReport,
  generateResumePDF
};
