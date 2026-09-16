import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

type InterviewAnalysis = {
  communication: number;
  speaking: number;
  technicalSkills: number;
  problemSolving: number;
};

type InterviewHistoryItem = {
  id: string;
  date: string;
  type: string;
  experience: string;
  questions: number;
  answers?: string[];
  feedback: string;
  analysis?: InterviewAnalysis;
};

function Feedback() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const [analysis, setAnalysis] = useState<InterviewAnalysis>({
    communication: 0,
    speaking: 0,
    technicalSkills: 0,
    problemSolving: 0,
  });

  const questions = [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Explain one project that you have worked on.",
    "Why should we hire you?",
    "Where do you see yourself in the next five years?",
  ];

  /*
   * Convert any AI score into 0-100.
   *
   * Examples:
   * 7/10   -> 70
   * 8/10   -> 80
   * 70/100 -> 70
   * 80      -> 80
   * 700     -> 70   <-- protects against old bad data
   */
  const normalizeScore = (value: number): number => {
    if (!Number.isFinite(value)) {
      return 0;
    }

    let score = value;

    // If old data accidentally contains 700, 800, etc.
    if (score > 100) {
      score = score / 10;
    }

    // If AI gives 7/10, convert to 70/100.
    if (score > 0 && score <= 10) {
      score = score * 10;
    }

    return Math.round(Math.min(Math.max(score, 0), 100));
  };

  /*
   * Extract score from Gemini feedback.
   *
   * Supports:
   * Communication: 7/10
   * Communication: 7
   * Communication Score: 7/10
   * Communication: 70/100
   */
  const extractScore = (
    feedbackText: string,
    labels: string[]
  ): number => {
    for (const label of labels) {
      const escapedLabel = label.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(
        `${escapedLabel}(?:\\s+score)?\\s*[:\\-]?\\s*(\\d{1,3})(?:\\s*\\/\\s*(10|100))?`,
        "i"
      );

      const match = feedbackText.match(regex);

      if (match) {
        const rawScore = Number(match[1]);
        const denominator = match[2]
          ? Number(match[2])
          : null;

        // If explicitly written as 7/10
        if (denominator === 10) {
          return Math.round(rawScore * 10);
        }

        // If explicitly written as 70/100
        if (denominator === 100) {
          return Math.round(rawScore);
        }

        return normalizeScore(rawScore);
      }
    }

    return 0;
  };

  /*
   * Extract all analysis scores.
   */
  const extractAnalysisScores = (
    feedbackText: string
  ): InterviewAnalysis => {
    const communication = extractScore(feedbackText, [
      "Communication",
    ]);

    const speaking = extractScore(feedbackText, [
      "Speaking",
      "Speaking Skills",
      "Speaking Clarity",
      "Clarity",
    ]);

    const technicalSkills = extractScore(feedbackText, [
      "Technical Skills",
      "Technical Skill",
      "Technical",
    ]);

    const problemSolving = extractScore(feedbackText, [
      "Problem Solving",
      "Problem-Solving",
      "Problem Solving Skills",
    ]);

    const result = {
      communication: normalizeScore(communication),
      speaking: normalizeScore(speaking),
      technicalSkills: normalizeScore(technicalSkills),
      problemSolving: normalizeScore(problemSolving),
    };

    console.log("📊 FINAL NORMALIZED ANALYSIS:", result);

    return result;
  };

  /*
   * Generate AI feedback.
   */
  useEffect(() => {
    const generateFeedback = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("🚀 Feedback page loaded");

        // Get answers from localStorage
        const savedAnswers =
          localStorage.getItem("interviewAnswers");

        const answers = savedAnswers
          ? JSON.parse(savedAnswers)
          : [];

        console.log("📝 Questions:", questions);
        console.log("📝 Answers:", answers);

        if (
          !Array.isArray(answers) ||
          answers.length === 0
        ) {
          setError(
            "No interview answers found. Please complete the interview again."
          );

          setLoading(false);
          return;
        }

        console.log("📡 Calling backend...");

        const response = await api.post("/ai/feedback", {
          questions,
          answers,
        });

        console.log(
          "🔥 COMPLETE BACKEND RESPONSE:",
          response.data
        );

        const generatedFeedback =
          response.data?.feedback;

        console.log(
          "🔥 GENERATED FEEDBACK:",
          generatedFeedback
        );

        if (
          !generatedFeedback ||
          typeof generatedFeedback !== "string"
        ) {
          console.error(
            "❌ Feedback missing from backend response"
          );

          setError(
            "Backend returned an invalid feedback response."
          );

          setLoading(false);
          return;
        }

        /*
         * Extract analysis.
         */
        const generatedAnalysis =
          extractAnalysisScores(
            generatedFeedback
          );

        console.log(
          "📊 AI ANALYSIS SCORES:",
          generatedAnalysis
        );

        /*
         * Set feedback and analysis.
         */
        setFeedback(generatedFeedback);
        setAnalysis(generatedAnalysis);

        /*
         * Load existing history.
         */
        const savedHistory =
          localStorage.getItem("interviewHistory");

        let interviewHistory: InterviewHistoryItem[] =
          [];

        if (savedHistory) {
          try {
            const parsedHistory =
              JSON.parse(savedHistory);

            if (Array.isArray(parsedHistory)) {
              interviewHistory = parsedHistory;
            }
          } catch (historyError) {
            console.error(
              "❌ Failed to parse history:",
              historyError
            );
          }
        }

        /*
         * Interview type and experience.
         */
        const interviewType =
          localStorage.getItem("interviewType") ||
          "Technical";

        const experience =
          localStorage.getItem("experience") ||
          "Fresher";

        /*
         * IMPORTANT:
         * Do not blindly update history[0].
         * Create a new interview result for this session.
         */
        const newInterview: InterviewHistoryItem = {
          id: Date.now().toString(),
          date: new Date().toLocaleString(),
          type: interviewType,
          experience: experience,
          questions: questions.length,
          answers: answers,
          feedback: generatedFeedback,
          analysis: generatedAnalysis,
        };

        /*
         * Add latest interview to beginning.
         */
        interviewHistory.unshift(newInterview);

        /*
         * Save history.
         */
        localStorage.setItem(
          "interviewHistory",
          JSON.stringify(interviewHistory)
        );

        console.log(
          "✅ Interview history saved:",
          newInterview
        );

        console.log(
          "🎯 Communication:",
          generatedAnalysis.communication
        );

        console.log(
          "🎯 Speaking:",
          generatedAnalysis.speaking
        );

        console.log(
          "🎯 Technical:",
          generatedAnalysis.technicalSkills
        );

        console.log(
          "🎯 Problem Solving:",
          generatedAnalysis.problemSolving
        );
      } catch (error: any) {
        console.error(
          "❌ FRONTEND FEEDBACK ERROR:",
          error
        );

        console.error(
          "❌ ERROR RESPONSE:",
          error?.response?.data
        );

        console.error(
          "❌ ERROR STATUS:",
          error?.response?.status
        );

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to generate AI feedback. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    generateFeedback();
  }, []);

  /*
   * Loading screen.
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />

            <h1 className="text-2xl font-bold">
              Generating AI Feedback...
            </h1>

            <p className="mt-2 text-slate-400">
              Please wait while AI analyzes your
              interview.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error screen.
   */
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
            <h1 className="text-2xl font-bold text-red-400">
              Feedback Error
            </h1>

            <p className="mt-3 whitespace-pre-wrap text-red-300">
              {error}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500"
            >
              Back to Dashboard
            </button>

            <button
              onClick={() => window.location.reload()}
              className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Analysis card.
   *
   * IMPORTANT:
   * We display score directly.
   *
   * ❌ NOT:
   * {score * 10}
   *
   * Because score is already 0-100.
   */
  const AnalysisCard = ({
    icon,
    title,
    score,
    textColor,
  }: {
    icon: string;
    title: string;
    score: number;
    textColor: string;
  }) => {
    const safeScore = normalizeScore(score);

    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10">
        <div className="flex items-center justify-between">
          <span className="text-3xl">
            {icon}
          </span>

          <span className="text-sm text-slate-500">
            /100
          </span>
        </div>

        <p className="mt-6 text-base text-slate-300">
          {title}
        </p>

        {/* IMPORTANT: direct score */}
        <p
          className={`mt-2 text-3xl font-bold ${textColor}`}
        >
          {safeScore}
        </p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              title === "Communication"
                ? "bg-indigo-500"
                : title === "Speaking"
                ? "bg-purple-500"
                : title === "Technical Skills"
                ? "bg-cyan-400"
                : "bg-pink-500"
            }`}
            style={{
              width: `${safeScore}%`,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-400">
            AI MOCK INTERVIEW
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            AI Interview Feedback
          </h1>

          <p className="mt-2 text-slate-400">
            Here is your personalized interview
            performance analysis.
          </p>
        </div>

        {/* Analysis */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Performance Analysis
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              AI-powered analysis of your interview
              performance.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <AnalysisCard
              icon="💬"
              title="Communication"
              score={analysis.communication}
              textColor="text-indigo-400"
            />

            <AnalysisCard
              icon="🎤"
              title="Speaking"
              score={analysis.speaking}
              textColor="text-purple-400"
            />

            <AnalysisCard
              icon="💻"
              title="Technical Skills"
              score={analysis.technicalSkills}
              textColor="text-cyan-400"
            />

            <AnalysisCard
              icon="🧠"
              title="Problem Solving"
              score={analysis.problemSolving}
              textColor="text-pink-400"
            />

          </div>
        </div>

        {/* AI Feedback */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold">
              AI
            </div>

            <div>
              <p className="font-medium">
                AI Interview Evaluator
              </p>

              <p className="text-sm text-slate-500">
                Personalized interview analysis
              </p>
            </div>
          </div>

          <div className="whitespace-pre-wrap break-words leading-7 text-slate-300">
            {feedback}
          </div>
        </div>

        {/* Success */}
        <div className="mt-5 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <p className="text-sm text-green-400">
            ✓ Your AI feedback and performance
            analysis have been saved to interview
            history.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => navigate("/history")}
            className="rounded-lg border border-indigo-500/30 px-6 py-3 font-medium text-indigo-400 transition hover:bg-indigo-500/10"
          >
            View Interview History
          </button>

          <button
            onClick={() =>
              navigate("/interview-setup")
            }
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500"
          >
            Start New Interview →
          </button>
        </div>

      </div>
    </div>
  );
}

export default Feedback;