import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InterviewSetup() {
  const navigate = useNavigate();

  const [interviewType, setInterviewType] =
    useState("Technical");

  const [experience, setExperience] =
    useState("Fresher");

  const [questions, setQuestions] =
    useState("5");

  const handleStartInterview = () => {
    // Save interview settings
    localStorage.setItem(
      "interviewType",
      interviewType
    );

    localStorage.setItem(
      "experience",
      experience
    );

    localStorage.setItem(
      "questionCount",
      questions
    );

    // Go directly to interview page
    navigate("/interview");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </button>

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-400">
            INTERVIEW SETUP
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Customize Your Interview
          </h1>

          <p className="mt-2 text-slate-400">
            Choose your preferences before starting your
            mock interview.
          </p>
        </div>

        {/* Interview Type */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <label className="mb-3 block font-medium">
            Interview Type
          </label>

          <select
            value={interviewType}
            onChange={(e) =>
              setInterviewType(e.target.value)
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          >
            <option value="Technical">
              Technical Interview
            </option>

            <option value="HR">
              HR Interview
            </option>

            <option value="Behavioral">
              Behavioral Interview
            </option>

            <option value="Mixed">
              Mixed Interview
            </option>
          </select>
        </div>

        {/* Experience */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <label className="mb-3 block font-medium">
            Experience Level
          </label>

          <select
            value={experience}
            onChange={(e) =>
              setExperience(e.target.value)
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          >
            <option value="Fresher">
              Fresher
            </option>

            <option value="Junior">
              Junior Developer
            </option>

            <option value="Mid">
              Mid-Level Developer
            </option>

            <option value="Senior">
              Senior Developer
            </option>
          </select>
        </div>

        {/* Number of Questions */}
        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <label className="mb-3 block font-medium">
            Number of Questions
          </label>

          <select
            value={questions}
            onChange={(e) =>
              setQuestions(e.target.value)
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          >
            <option value="5">
              5 Questions
            </option>

            <option value="10">
              10 Questions
            </option>

            <option value="15">
              15 Questions
            </option>
          </select>
        </div>

        {/* Summary */}
        <div className="mb-6 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-6">
          <h2 className="font-semibold">
            Interview Summary
          </h2>

          <div className="mt-4 space-y-2 text-sm text-slate-300">

            <p>
              Type:{" "}
              <span className="text-white">
                {interviewType}
              </span>
            </p>

            <p>
              Experience:{" "}
              <span className="text-white">
                {experience}
              </span>
            </p>

            <p>
              Questions:{" "}
              <span className="text-white">
                {questions}
              </span>
            </p>

          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartInterview}
          className="w-full rounded-lg bg-indigo-600 py-3 font-medium transition hover:bg-indigo-500"
        >
          Start Mock Interview →
        </button>

      </div>
    </div>
  );
}

export default InterviewSetup;