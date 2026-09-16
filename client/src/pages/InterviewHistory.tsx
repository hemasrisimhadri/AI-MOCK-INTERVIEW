import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type InterviewHistoryItem = {
  id: string;
  date: string;
  type: string;
  experience: string;
  questions: number;
  feedback: string;
};

function InterviewHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("interviewHistory");

    if (!savedHistory) {
      return;
    }

    try {
      const parsedHistory = JSON.parse(savedHistory);

      if (Array.isArray(parsedHistory)) {
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to load interview history:", error);
    }
  }, []);

  const handleClearHistory = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to clear all interview history?"
    );

    if (!confirmDelete) {
      return;
    }

    localStorage.removeItem("interviewHistory");
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-8 flex items-start justify-between">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-5 text-sm text-slate-400 transition hover:text-white"
            >
              ← Back to Dashboard
            </button>

            <p className="text-sm font-medium text-indigo-400">
              INTERVIEW HISTORY
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Your Interview History
            </h1>

            <p className="mt-2 text-slate-400">
              Review your previous mock interview sessions.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              Clear History
            </button>
          )}
        </div>

        {/* Empty State */}

        {history.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-3xl">
              📋
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No Interviews Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Complete your first mock interview and your
              interview history will appear here.
            </p>

            <button
              onClick={() => navigate("/interview-setup")}
              className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500"
            >
              Start Mock Interview →
            </button>
          </div>
        ) : (
          <div className="space-y-5">

            {history.map((interview) => (
              <div
                key={interview.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
              >

                {/* Interview Header */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h2 className="text-lg font-semibold">
                      {interview.type} Interview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {interview.date}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                    {interview.experience}
                  </span>
                </div>

                {/* Details */}

                <div className="mt-6 grid gap-4 sm:grid-cols-3">

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">
                      Interview Type
                    </p>

                    <p className="mt-1 font-medium">
                      {interview.type}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">
                      Experience
                    </p>

                    <p className="mt-1 font-medium">
                      {interview.experience}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">
                      Questions
                    </p>

                    <p className="mt-1 font-medium">
                      {interview.questions}
                    </p>
                  </div>

                </div>

                {/* AI Feedback */}

                <div className="mt-5 rounded-lg border border-indigo-500/10 bg-indigo-500/5 p-4">

                  <p className="text-xs font-medium text-indigo-400">
                    AI FEEDBACK
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                    {interview.feedback}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default InterviewHistory; 