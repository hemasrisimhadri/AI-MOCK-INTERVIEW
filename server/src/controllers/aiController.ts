import { Request, Response } from "express";
import { generateInterviewFeedback } from "../services/geminiService";

export const getInterviewFeedback = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("📥 Feedback request received");

    const { questions, answers } = req.body;

    console.log("Questions:", questions);
    console.log("Answers:", answers);

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions are required.",
      });
    }

    // Validate answers
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers are required.",
      });
    }

    console.log("🤖 Generating AI feedback...");

    // Generate feedback from Gemini
    const feedback = await generateInterviewFeedback(
      questions,
      answers
    );

    console.log("✅ AI feedback generated successfully.");

    // Make sure feedback is a string
    const feedbackText =
      typeof feedback === "string"
        ? feedback.trim()
        : String(feedback || "").trim();

    console.log(
      "📤 Sending feedback to frontend:"
    );

    console.log(feedbackText);

    // Check empty response
    if (!feedbackText) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned empty feedback.",
      });
    }

    // IMPORTANT:
    // Send feedback as a STRING inside `feedback`
    return res.status(200).json({
      success: true,
      feedback: feedbackText,
    });
  } catch (error: any) {
    console.error("❌ AI Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to generate AI feedback.",
    });
  }
};