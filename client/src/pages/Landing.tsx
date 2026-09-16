import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-xl font-bold">
            AI Mock Interview
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium transition hover:scale-105 hover:bg-indigo-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-6">
        <section className="grid min-h-[75vh] items-center gap-12 py-16 md:grid-cols-2">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-4 text-sm font-semibold tracking-wide text-indigo-400">
              AI-POWERED INTERVIEW PRACTICE
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Practice Interviews.
              <span className="block text-indigo-400">
                Build Confidence.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Prepare for your next job interview with AI-generated
              questions and personalized feedback.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="rounded-lg bg-indigo-600 px-6 py-3 font-medium transition hover:scale-105 hover:bg-indigo-500"
              >
                Start Interview
              </Link>

              <a
                href="#features"
                className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:border-indigo-500 hover:text-white"
              >
                Learn More
              </a>
            </div>

            {/* Small Features */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold">AI Questions</p>
                <p className="mt-1 text-xs text-slate-500">
                  Role-based questions
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold">AI Feedback</p>
                <p className="mt-1 text-xs text-slate-500">
                  Improve your answers
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold">Track Progress</p>
                <p className="mt-1 text-xs text-slate-500">
                  Monitor your scores
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Interview Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <p className="text-sm font-semibold">
                    Mock Interview
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Frontend Developer
                  </p>
                </div>

                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400">
                  Question 2/5
                </span>
              </div>

              {/* Question */}
              <div className="py-6">
                <p className="text-sm text-slate-400">
                  Question
                </p>

                <h3 className="mt-2 text-lg font-semibold leading-7">
                  What is the difference between let, const and var
                  in JavaScript?
                </h3>
              </div>

              {/* Fake Answer Box */}
              <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <p className="text-sm text-slate-500">
                  Type your answer here...
                </p>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs text-slate-500">
                  <span>Progress</span>
                  <span>40%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-2/5 rounded-full bg-indigo-600" />
                </div>
              </div>

              <button className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium transition hover:bg-indigo-500">
                Continue
              </button>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-slate-800 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold text-indigo-400">
              FEATURES
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Everything you need to practice
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Simple tools to help you prepare, practice, and
              improve your interview skills.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-indigo-500">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                01
              </div>

              <h3 className="text-lg font-semibold">
                AI Generated Questions
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Get interview questions based on your selected
                job role and interview type.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-indigo-500">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                02
              </div>

              <h3 className="text-lg font-semibold">
                Personalized Feedback
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Understand your strengths and areas that need
                improvement after every interview.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-indigo-500">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                03
              </div>

              <h3 className="text-lg font-semibold">
                Track Your Progress
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Keep track of your interview scores and see how
                your performance improves over time.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © 2026 AI Mock Interview. Built for interview practice.
      </footer>
    </div>
  );
}

export default Landing;