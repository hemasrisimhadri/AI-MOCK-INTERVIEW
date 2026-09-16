import { Request, Response } from "express";
import { interviewQuestions } from "../data/interviewQuestions";

export const getInterviewQuestions = (
  req: Request,
  res: Response
) => {
  try {
    const { category, difficulty } = req.query;

    let questions = interviewQuestions;

    if (category) {
      questions = questions.filter(
        (question) =>
          question.category.toLowerCase() ===
          String(category).toLowerCase()
      );
    }

    if (difficulty) {
      questions = questions.filter(
        (question) =>
          question.difficulty.toLowerCase() ===
          String(difficulty).toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get interview questions",
    });
  }
};