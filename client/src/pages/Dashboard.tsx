import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type InterviewHistoryItem = {
  id: string;
  date: string;
  type: string;
  experience: string;
  questions: number;
  answers?: string[];
  feedback: string;

  analysis?: {
    communication?: number;
    speaking?: number;
    technicalSkills?: number;
    problemSolving?: number;
  };
};

type SkillData = {
  name: string;
  value: number;
};

function Dashboard() {
  const navigate = useNavigate();

  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [userName, setUserName] = useState("User");

  // ============================================
  // LOAD DASHBOARD DATA
  // ============================================

  useEffect(() => {
    const loadHistory = () => {
      const savedHistory =
        localStorage.getItem("interviewHistory");

      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);

          if (Array.isArray(parsedHistory)) {
            setHistory(parsedHistory);
          }
        } catch (error) {
          console.error(
            "Failed to load interview history:",
            error
          );

          setHistory([]);
        }
      } else {
        setHistory([]);
      }
    };

    // Load user
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        if (user?.name) {
          setUserName(user.name);
        } else if (user?.username) {
          setUserName(user.username);
        }
      } catch (error) {
        console.error(
          "Failed to load user:",
          error
        );
      }
    }

    loadHistory();

    // Refresh dashboard when storage changes
    const handleStorageChange = () => {
      loadHistory();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // ============================================
  // BASIC STATISTICS
  // ============================================

  const totalInterviews = history.length;

  const totalQuestions = history.reduce(
    (total, interview) =>
      total + (interview.questions || 0),
    0
  );

  // ============================================
  // SCORE CALCULATOR
  // ============================================

  const calculateScore = (
    feedback: string
  ): number => {
    if (!feedback) {
      return 0;
    }

    const match = feedback.match(
      /(?:overall\s+score|score|rating)\s*:?\s*(\d{1,3})(?:\s*\/\s*10)?/i
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

  // ============================================
  // AVERAGE SCORE
  // ============================================

  const scores = history
    .map((interview) =>
      calculateScore(interview.feedback)
    )
    .filter((score) => score > 0);

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, score) =>
              total + score,
            0
          ) / scores.length
        )
      : 0;

  // ============================================
  // RECENT INTERVIEW
  // ============================================

  const recentInterview =
    history.length > 0
      ? history[0]
      : null;

  // ============================================
  // ANALYSIS DATA
  // ============================================

  const getSkillScore = (
    skill:
      | "communication"
      | "speaking"
      | "technicalSkills"
      | "problemSolving"
  ) => {
    if (!history.length) {
      return 0;
    }

    const values = history
      .map(
        (interview) =>
          interview.analysis?.[skill] || 0
      )
      .filter((value) => value > 0);

    if (values.length === 0) {
      return 0;
    }

    return Math.round(
      (values.reduce(
        (total, value) =>
          total + value,
        0
      ) /
        values.length) *
        10
    );
  };

  // ============================================
  // SKILL DATA FOR PIE CHART
  // ============================================

  const skillData: SkillData[] = useMemo(
    () => [
      {
        name: "Communication",
        value: getSkillScore(
          "communication"
        ),
      },
      {
        name: "Speaking",
        value: getSkillScore(
          "speaking"
        ),
      },
      {
        name: "Technical Skills",
        value: getSkillScore(
          "technicalSkills"
        ),
      },
      {
        name: "Problem Solving",
        value: getSkillScore(
          "problemSolving"
        ),
      },
    ],
    [history]
  );

  // ============================================
  // BAR CHART DATA
  // ============================================

  const scoreChartData = useMemo(() => {
    return history
      .slice(0, 7)
      .reverse()
      .map((interview, index) => ({
        name: `Interview ${index + 1}`,
        score: calculateScore(
          interview.feedback
        ),
      }));
  }, [history]);

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ============================================
  // PIE COLORS
  // ============================================

  const pieColors = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
  ];

  // ============================================
  // UI
  // ============================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* ======================================
            SIDEBAR
        ====================================== */}

        <aside className="min-h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-900 p-5">

          {/* Logo */}

          <div className="mb-8">
            <h1 className="text-xl font-bold text-indigo-400">
              AI Mock Interview
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Practice. Improve. Succeed.
            </p>
          </div>

          {/* Navigation */}

          <nav className="space-y-2">

            {/* Dashboard */}

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="group w-full rounded-lg bg-indigo-600 px-4 py-3 text-left text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              🏠 Dashboard
            </button>

            {/* Mock Interview */}

            <button
              onClick={() =>
                navigate("/interview-setup")
              }
              className="group w-full rounded-lg px-4 py-3 text-left text-sm text-slate-300 transition-all duration-200 hover:translate-x-1 hover:bg-slate-800 hover:text-white"
            >
              🎤 Mock Interview
            </button>

            {/* History */}

            <button
              onClick={() =>
                navigate("/history")
              }
              className="group w-full rounded-lg px-4 py-3 text-left text-sm text-slate-300 transition-all duration-200 hover:translate-x-1 hover:bg-slate-800 hover:text-white"
            >
              📋 Interview History
            </button>

            {/* Profile */}

            <button
              onClick={() =>
                navigate("/profile")
              }
              className="group w-full rounded-lg px-4 py-3 text-left text-sm text-slate-300 transition-all duration-200 hover:translate-x-1 hover:bg-slate-800 hover:text-white"
            >
              👤 Profile
            </button>

            {/* Settings */}

            <button
              onClick={() =>
                navigate("/settings")
              }
              className="group w-full rounded-lg px-4 py-3 text-left text-sm text-slate-300 transition-all duration-200 hover:translate-x-1 hover:bg-slate-800 hover:text-white"
            >
              ⚙️ Settings
            </button>

          </nav>

          {/* Logout */}

          <div className="mt-10 border-t border-slate-800 pt-5">
            <button
              onClick={handleLogout}
              className="group w-full rounded-lg px-4 py-3 text-left text-sm text-red-400 transition-all duration-200 hover:translate-x-1 hover:bg-slate-800 hover:text-white"
            >
              🚪 Logout
            </button>
          </div>

        </aside>

        {/* ======================================
            MAIN CONTENT
        ====================================== */}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

          {/* Welcome */}

          <div>
            <p className="text-sm font-medium text-indigo-400">
              WELCOME BACK 👋
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Hi, {userName}
            </h1>

            <p className="mt-2 text-slate-400">
              Prepare yourself for your next
              interview.
            </p>
          </div>

          {/* ====================================
              START INTERVIEW CARD
          ==================================== */}

          <div className="mt-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-8 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10">

            <p className="text-sm font-medium text-indigo-400">
              MOCK INTERVIEW
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Start a Mock Interview
            </h2>

            <p className="mt-2 max-w-xl leading-6 text-slate-400">
              Choose your interview type and
              practice questions designed to
              simulate a real interview.
            </p>

            <button
              onClick={() =>
                navigate("/interview-setup")
              }
              className="mt-6 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-1 hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl hover:shadow-indigo-500/30"
            >
              Start Interview →
            </button>

          </div>

          {/* ====================================
              QUICK STATS
          ==================================== */}

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            {/* Interviews */}

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10">

              <p className="text-sm text-slate-400">
                Interviews Completed
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {totalInterviews}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Completed sessions
              </p>

            </div>

            {/* Average Score */}

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10">

              <p className="text-sm text-slate-400">
                Average Score
              </p>

              <h3 className="mt-2 text-2xl font-bold text-indigo-400">
                {averageScore > 0
                  ? `${averageScore}%`
                  : "--"}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Based on AI feedback
              </p>

            </div>

            {/* Questions */}

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10">

              <p className="text-sm text-slate-400">
                Questions Practiced
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {totalQuestions}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Across all interviews
              </p>

            </div>

          </div>

          {/* ====================================
              PERFORMANCE ANALYSIS
          ==================================== */}

          <div className="mt-10">

            <div className="mb-5">
              <p className="text-sm font-medium text-indigo-400">
                AI ANALYSIS
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Interview Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track your interview performance
                and skill development.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

              {/* ==================================
                  SCORE BAR CHART
              ================================== */}

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <div className="mb-6">
                  <h3 className="text-lg font-semibold">
                    Score Progress
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your recent interview scores
                  </p>
                </div>

                {scoreChartData.length > 0 ? (
                  <div className="h-72 w-full">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={scoreChartData}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#334155"
                        />

                        <XAxis
                          dataKey="name"
                          stroke="#94a3b8"
                          fontSize={12}
                        />

                        <YAxis
                          domain={[0, 100]}
                          stroke="#94a3b8"
                          fontSize={12}
                        />

                        <Tooltip
                          contentStyle={{
                            backgroundColor:
                              "#0f172a",
                            border:
                              "1px solid #334155",
                            borderRadius:
                              "8px",
                            color: "#fff",
                          }}
                        />

                        <Bar
                          dataKey="score"
                          fill="#6366f1"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                        />
                      </BarChart>
                    </ResponsiveContainer>

                  </div>
                ) : (
                  <div className="flex h-72 items-center justify-center text-center">
                    <div>
                      <div className="text-4xl">
                        📊
                      </div>

                      <p className="mt-3 text-slate-400">
                        Complete an interview to
                        see your score progress.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* ==================================
                  SKILLS PIE CHART
              ================================== */}

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    Skill Analysis
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    AI evaluation of your core
                    interview skills
                  </p>
                </div>

                {skillData.some(
                  (skill) => skill.value > 0
                ) ? (
                  <div className="h-72 w-full">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>

                        <Pie
                          data={skillData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {skillData.map(
                            (_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  pieColors[
                                    index %
                                      pieColors.length
                                  ]
                                }
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            backgroundColor:
                              "#0f172a",
                            border:
                              "1px solid #334155",
                            borderRadius:
                              "8px",
                            color: "#fff",
                          }}
                        />

                        <Legend
                          wrapperStyle={{
                            fontSize: "12px",
                          }}
                        />

                      </PieChart>
                    </ResponsiveContainer>

                  </div>
                ) : (
                  <div className="flex h-72 items-center justify-center text-center">

                    <div>
                      <div className="text-4xl">
                        🥧
                      </div>

                      <p className="mt-3 text-slate-400">
                        Skill analysis will appear
                        after your AI feedback is
                        generated.
                      </p>
                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* ==================================
                SKILL SCORE CARDS
            ================================== */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Communication */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all hover:-translate-y-1 hover:border-indigo-500/40">

                <div className="flex items-center justify-between">
                  <span className="text-2xl">
                    💬
                  </span>

                  <span className="text-xs text-slate-500">
                    /100
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-400">
                  Communication
                </p>

                <p className="mt-1 text-2xl font-bold text-indigo-400">
                  {getSkillScore(
                    "communication"
                  ) || "--"}
                </p>

              </div>

              {/* Speaking */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all hover:-translate-y-1 hover:border-purple-500/40">

                <div className="flex items-center justify-between">
                  <span className="text-2xl">
                    🎤
                  </span>

                  <span className="text-xs text-slate-500">
                    /100
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-400">
                  Speaking
                </p>

                <p className="mt-1 text-2xl font-bold text-purple-400">
                  {getSkillScore(
                    "speaking"
                  ) || "--"}
                </p>

              </div>

              {/* Technical */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all hover:-translate-y-1 hover:border-cyan-500/40">

                <div className="flex items-center justify-between">
                  <span className="text-2xl">
                    💻
                  </span>

                  <span className="text-xs text-slate-500">
                    /100
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-400">
                  Technical Skills
                </p>

                <p className="mt-1 text-2xl font-bold text-cyan-400">
                  {getSkillScore(
                    "technicalSkills"
                  ) || "--"}
                </p>

              </div>

              {/* Problem Solving */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all hover:-translate-y-1 hover:border-pink-500/40">

                <div className="flex items-center justify-between">
                  <span className="text-2xl">
                    🧠
                  </span>

                  <span className="text-xs text-slate-500">
                    /100
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-400">
                  Problem Solving
                </p>

                <p className="mt-1 text-2xl font-bold text-pink-400">
                  {getSkillScore(
                    "problemSolving"
                  ) || "--"}
                </p>

              </div>

            </div>

          </div>

          {/* ====================================
              RECENT INTERVIEW
          ==================================== */}

          <div className="mt-10">

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Recent Interview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest practice session
                </p>
              </div>

              {history.length > 0 && (
                <button
                  onClick={() =>
                    navigate("/history")
                  }
                  className="text-sm text-indigo-400 transition hover:text-indigo-300"
                >
                  View All →
                </button>
              )}

            </div>

            {recentInterview ? (

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="text-lg font-semibold">
                      {recentInterview.type} Interview
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {recentInterview.date}
                    </p>

                  </div>

                  <span className="w-fit rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                    {recentInterview.experience}
                  </span>

                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">

                    <p className="text-xs text-slate-500">
                      Questions
                    </p>

                    <p className="mt-1 font-semibold">
                      {recentInterview.questions}
                    </p>

                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">

                    <p className="text-xs text-slate-500">
                      Interview Type
                    </p>

                    <p className="mt-1 font-semibold">
                      {recentInterview.type}
                    </p>

                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">

                    <p className="text-xs text-slate-500">
                      Score
                    </p>

                    <p className="mt-1 font-semibold text-indigo-400">
                      {calculateScore(
                        recentInterview.feedback
                      ) > 0
                        ? `${calculateScore(
                            recentInterview.feedback
                          )}%`
                        : "--"}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate("/history")
                  }
                  className="mt-5 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white"
                >
                  View Interview History →
                </button>

              </div>

            ) : (

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">

                <div className="text-3xl">
                  🎤
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                  No interviews yet
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Complete your first mock
                  interview to see your
                  progress here.
                </p>

                <button
                  onClick={() =>
                    navigate("/interview-setup")
                  }
                  className="mt-5 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium transition hover:bg-indigo-500"
                >
                  Start Your First Interview →
                </button>

              </div>

            )}

          </div>

        </main>

      </div>
    </div>
  );
}

export default Dashboard;