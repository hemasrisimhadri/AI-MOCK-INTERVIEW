import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

export const generateInterviewFeedback = async (
  questions: string[],
  answers: string[]
) => {
  const interviewData = questions
    .map((question, index) => {
      return `
Question ${index + 1}:
${question}

Candidate Answer:
${answers[index] || "No answer provided"}
`;
    })
    .join("\n");

  const prompt = `
You are an expert AI interview evaluator.

Analyze the following mock interview carefully.

${interviewData}

Evaluate the candidate professionally.

Return the response EXACTLY in the following format:

Overall Score: X/10

Communication: X/10
Technical Skills: X/10
Confidence: X/10
Problem Solving: X/10
Speaking Clarity: X/10

Strengths:

- Point 1
- Point 2
- Point 3

Areas for Improvement:

- Point 1
- Point 2
- Point 3

Question-wise Feedback:

1. Question:
   Feedback:

2. Question:
   Feedback:

3. Question:
   Feedback:

4. Question:
   Feedback:

5. Question:
   Feedback:

Final Recommendation:
Give a short and useful recommendation for the candidate.

IMPORTANT RULES:

1. All scores must be numbers from 1 to 10.
2. Communication evaluates how clearly and effectively the candidate communicates ideas.
3. Technical Skills evaluates technical knowledge relevant to the interview.
4. Confidence evaluates how confidently the candidate presents answers.
5. Problem Solving evaluates logical thinking and ability to approach problems.
6. Speaking Clarity evaluates how clear and understandable the candidate's answers are.
7. Do not change the labels.
8. Do not remove any of the five skill scores.
9. Do not return JSON.
10. Keep the response professional and easy to read.
`;

  try {
    console.log(
      "🤖 Generating AI feedback using Gemini..."
    );

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const feedback = response.text;

    if (
      !feedback ||
      feedback.trim().length === 0
    ) {
      throw new Error(
        "Gemini returned an empty feedback response."
      );
    }

    console.log(
      "✅ Gemini returned feedback successfully."
    );

    console.log(
      "📊 AI Analysis generated successfully."
    );

    return feedback;
  } catch (error: any) {
    console.error(
      "❌ Gemini feedback generation failed:"
    );

    console.error(error);

    throw new Error(
      error?.message ||
        "Failed to generate AI interview feedback."
    );
  }
};