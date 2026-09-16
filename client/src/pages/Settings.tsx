import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-400">
            PREFERENCES
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your application preferences.
          </p>
        </div>

        {/* Interview Settings */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-lg font-semibold">
            Interview Preferences
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Customize your mock interview experience.
          </p>

          <div className="mt-6 space-y-6">

            {/* Default Interview Type */}
            <div>
              <label className="text-sm text-slate-300">
                Default Interview Type
              </label>

              <select
                defaultValue="Technical"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option>Technical</option>
                <option>HR</option>
                <option>Behavioral</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-sm text-slate-300">
                Default Difficulty
              </label>

              <select
                defaultValue="Medium"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

          </div>
        </div>

        {/* Notifications */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-lg font-semibold">
            Notifications
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Choose which notifications you want to receive.
          </p>

          <div className="mt-6 space-y-5">

            {/* Email Notifications */}
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Email Notifications
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Receive interview reminders and updates.
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 accent-indigo-600"
              />
            </label>

            {/* Interview Reminders */}
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Interview Reminders
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Get reminders to keep practicing.
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 accent-indigo-600"
              />
            </label>

          </div>
        </div>

        {/* Account */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-lg font-semibold">
            Account
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage your account.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 rounded-lg border border-red-900 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-950"
          >
            Logout
          </button>

        </div>

        {/* Save */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => alert("Settings saved successfully!")}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium transition hover:bg-indigo-500"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}

export default Settings;