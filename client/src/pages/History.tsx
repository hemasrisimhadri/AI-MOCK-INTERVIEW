import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type InterviewHistoryItem = {
  id: string;
  date: string;
  type: string;
  experience: string;
  questions: number;
  answers?: string[];
  feedback: string;
};

function History() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState<InterviewHistoryItem[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD INTERVIEW HISTORY
  // ==========================================

  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory =
          localStorage.getItem("interviewHistory");

        if (!savedHistory) {
          setInterviews([]);
          return;
        }

        const parsedHistory = JSON.parse(savedHistory);

        if (Array.isArray(parsedHistory)) {
          setInterviews(parsedHistory);
        } else {
          setInterviews([]);
        }
      } catch (error) {
        console.error(
          "Failed to load interview history:",
          error
        );

        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // ==========================================
  // CALCULATE SCORE
  // ==========================================

  const calculateScore = (feedback: string) => {
    if (!feedback) {
      return 0;
    }

    const match = feedback.match(
      /(?:overall\s+score|score|rating)[^\d]*(\d{1,3})(?:\s*\/\s*10)?/i
    );

    if (!match) {
      return 0;
    }

    const score = Number(match[1]);

    if (score <= 10) {
      return score * 10;
    }

    return Math.min(score, 100);
  };

  // ==========================================
  // CLEAR HISTORY
  // ==========================================

  const handleClearHistory = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to clear all interview history?"
    );

    if (!confirmDelete) {
      return;
    }

    localStorage.removeItem("interviewHistory");

    setInterviews([]);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500"></div>

            <h1 className="text-xl font-semibold">
              Loading Interview History...
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Please wait.
            </p>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-5xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">

          <button
            onClick={() => navigate("/dashboard")}
            className="mb-6 text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-medium text-indigo-400">
                YOUR PROGRESS
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Interview History
              </h1>

              <p className="mt-2 text-slate-400">
                Review your previous mock interview sessions
                and track your progress.
              </p>

            </div>

            {/* Clear History */}

            {interviews.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="w-fit rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                Clear History
              </button>
            )}

          </div>

        </div>

        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {interviews.length === 0 ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-2xl">
              📋
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No Interviews Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              You haven't completed any mock interviews yet.
              Start your first interview and your results
              will appear here automatically.
            </p>

            <button
              onClick={() => navigate("/interview-setup")}
              className="mt-6 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-1 hover:from-indigo-500 hover:to-purple-500"
            >
              Start Mock Interview →
            </button>

          </div>

        ) : (

          /* ==========================================
             INTERVIEW LIST
          ========================================== */

          <div className="space-y-5">

            {interviews.map((interview) => {

              const score = calculateScore(
                interview.feedback
              );

              return (
                <div
                  key={interview.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10"
                >

                  {/* TOP */}

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <h2 className="text-lg font-semibold">
                        {interview.type || "Technical"} Interview
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {interview.date}
                      </p>

                    </div>

                    <span className="w-fit rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                      {interview.experience || "Fresher"}
                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">

                    {/* Questions */}

                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">

                      <p className="text-xs text-slate-500">
                        Questions
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {interview.questions || 0}
                      </p>

                    </div>

                    {/* Score */}

                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">

                      <p className="text-xs text-slate-500">
                        AI Score
                      </p>

                      <p className="mt-1 text-lg font-semibold text-indigo-400">
                        {score > 0
                          ? `${score}%`
                          : "--"}
                      </p>

                    </div>

                    {/* Date */}

                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">

                      <p className="text-xs text-slate-500">
                        Status
                      </p>

                      <p className="mt-1 text-lg font-semibold text-green-400">
                        Completed
                      </p>

                    </div>

                  </div>

                  {/* FEEDBACK */}

                  {interview.feedback && (
                    <div className="mt-5 rounded-lg border border-indigo-500/10 bg-indigo-500/5 p-4">

                      <p className="text-xs font-medium text-indigo-400">
                        AI FEEDBACK
                      </p>

                      <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                        {interview.feedback}
                      </p>

                    </div>
                  )}

                  {/* BUTTONS */}

                  <div className="mt-5 flex flex-wrap gap-3">

                    <button
                      onClick={() => navigate("/feedback")}
                      className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500"
                    >
                      View Feedback
                    </button>

                    <button
                      onClick={() => navigate("/interview-setup")}
                      className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 hover:text-white"
                    >
                      New Interview
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

        {/* ==========================================
            BOTTOM CTA
        ========================================== */}

        {interviews.length > 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">

            <p className="text-slate-400">
              Want to improve your interview performance?
            </p>

            <button
              onClick={() => navigate("/interview-setup")}
              className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              Start New Interview →
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default History;