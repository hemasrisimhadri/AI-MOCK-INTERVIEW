import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
};

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <h1 className="text-2xl font-bold">
              Profile Not Found
            </h1>

            <p className="mt-2 text-slate-400">
              Please login to view your profile.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const firstLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Back Button */}

        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}

        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-400">
            PROFILE
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Your Profile
          </h1>

          <p className="mt-2 text-slate-400">
            Manage and view your account information.
          </p>
        </div>

        {/* Profile Card */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          {/* Avatar */}

          <div className="flex flex-col items-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-4xl font-bold">
              {firstLetter}
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              {user.name}
            </h2>

            <p className="mt-1 text-slate-400">
              {user.email}
            </p>

          </div>

          {/* Account Information */}

          <div className="mt-10">

            <h3 className="mb-5 text-lg font-semibold">
              Account Information
            </h3>

            <div className="space-y-4">

              {/* Name */}

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs text-slate-500">
                  Full Name
                </p>

                <p className="mt-2 font-medium">
                  {user.name}
                </p>
              </div>

              {/* Email */}

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs text-slate-500">
                  Email Address
                </p>

                <p className="mt-2 font-medium">
                  {user.email}
                </p>
              </div>

              {/* User ID */}

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs text-slate-500">
                  User ID
                </p>

                <p className="mt-2 break-all font-medium text-slate-300">
                  {user.id}
                </p>
              </div>

            </div>

          </div>

          {/* Actions */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={() => navigate("/interview-setup")}
              className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500"
            >
              Start Interview →
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Back to Dashboard
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;