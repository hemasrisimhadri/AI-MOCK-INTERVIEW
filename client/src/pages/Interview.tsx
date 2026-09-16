import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


// ==============================
// Speech Recognition Types
// ==============================

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;

  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}


// ==============================
// Interview Component
// ==============================

function Interview() {
  const navigate = useNavigate();

  // ==============================
  // Interview State
  // ==============================

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState("");

  const [answers, setAnswers] = useState<string[]>([]);

  const [isListening, setIsListening] = useState(false);

  const [voiceError, setVoiceError] = useState("");

  // ==============================
  // Speech Recognition Refs
  // ==============================

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const isListeningRef = useRef(false);


  // ==============================
  // Questions
  // ==============================

  const questions = [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Explain one project that you have worked on.",
    "Why should we hire you?",
    "Where do you see yourself in the next five years.",
  ];

  const totalQuestions = questions.length;

  const progress =
    ((currentQuestion + 1) / totalQuestions) * 100;


  // ==============================
  // Load Existing Answers
  // ==============================

  useEffect(() => {
    const savedAnswers =
      localStorage.getItem("interviewAnswers");

    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);

        if (Array.isArray(parsedAnswers)) {
          setAnswers(parsedAnswers);

          setAnswer(
            parsedAnswers[currentQuestion] || ""
          );
        }
      } catch (error) {
        console.error(
          "Failed to load interview answers:",
          error
        );
      }
    }
  }, []);


  // ==============================
  // Cleanup Speech Recognition
  // ==============================

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error(
            "Speech recognition cleanup error:",
            error
          );
        }
      }

      isListeningRef.current = false;
    };
  }, []);


  // ==============================
  // Handle Text Answer
  // ==============================

  const handleAnswerChange = (
    value: string
  ) => {
    setAnswer(value);

    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = value;

    setAnswers(updatedAnswers);

    localStorage.setItem(
      "interviewAnswers",
      JSON.stringify(updatedAnswers)
    );
  };


  // ==============================
  // Start Voice Input
  // ==============================

  const startVoiceInput = () => {
    setVoiceError("");

    // Browser support check
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        "Voice input is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    // Prevent multiple recognition instances
    if (isListeningRef.current) {
      return;
    }

    // Stop previous recognition if any
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (error) {
        console.error(
          "Failed to abort previous recognition:",
          error
        );
      }
    }

    // Create new recognition
    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";


    // ==============================
    // Recognition Started
    // ==============================

    recognition.onstart = () => {
      console.log("🎤 Voice recognition started");

      isListeningRef.current = true;

      setIsListening(true);

      setVoiceError("");
    };


    // ==============================
    // Recognition Result
    // ==============================

    recognition.onresult = (
      event: SpeechRecognitionEventLike
    ) => {
      console.log(
        "🎤 Speech result received"
      );

      /*
       IMPORTANT:

       Do NOT do:

       setAnswer(
         answer + transcript
       );

       That causes:

       I am
       I am I am
       I am I am currently
       I am I am currently currently

       Instead we rebuild the complete transcript
       from recognition.results.
      */

      let completeTranscript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];

        if (result && result[0]) {
          completeTranscript +=
            result[0].transcript;
        }
      }

      // Remove unnecessary spaces
      completeTranscript =
        completeTranscript
          .replace(/\s+/g, " ")
          .trim();

      console.log(
        "📝 Voice transcript:",
        completeTranscript
      );

      if (!completeTranscript) {
        return;
      }

      // Update textarea
      setAnswer(completeTranscript);

      // Update answers array
      setAnswers((previousAnswers) => {
        const updatedAnswers = [
          ...previousAnswers,
        ];

        updatedAnswers[currentQuestion] =
          completeTranscript;

        // Save immediately
        localStorage.setItem(
          "interviewAnswers",
          JSON.stringify(updatedAnswers)
        );

        return updatedAnswers;
      });
    };


    // ==============================
    // Recognition Error
    // ==============================

    recognition.onerror = (
      event: SpeechRecognitionErrorEventLike
    ) => {
      console.error(
        "❌ Speech recognition error:",
        event.error
      );

      isListeningRef.current = false;

      setIsListening(false);

      if (event.error === "not-allowed") {
        setVoiceError(
          "Microphone permission was denied. Please allow microphone access in your browser."
        );
      } else if (
        event.error === "no-speech"
      ) {
        setVoiceError(
          "No speech detected. Please try speaking again."
        );
      } else if (
        event.error === "audio-capture"
      ) {
        setVoiceError(
          "Microphone could not be accessed. Please check your microphone."
        );
      } else if (
        event.error === "network"
      ) {
        setVoiceError(
          "Network error occurred during voice recognition."
        );
      } else if (
        event.error !== "aborted"
      ) {
        setVoiceError(
          "Voice input failed. Please try again."
        );
      }
    };


    // ==============================
    // Recognition Ended
    // ==============================

    recognition.onend = () => {
      console.log(
        "🎤 Voice recognition ended"
      );

      isListeningRef.current = false;

      setIsListening(false);
    };


    // ==============================
    // Start Recognition
    // ==============================

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "❌ Failed to start speech recognition:",
        error
      );

      isListeningRef.current = false;

      setIsListening(false);

      setVoiceError(
        "Could not start voice input. Please try again."
      );
    }
  };


  // ==============================
  // Stop Voice Input
  // ==============================

  const stopVoiceInput = () => {
    console.log(
      "🛑 Stopping voice recognition..."
    );

    isListeningRef.current = false;

    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error(
          "Failed to stop recognition:",
          error
        );
      }
    }
  };


  // ==============================
  // Next Question
  // ==============================

  const handleNext = () => {
    // Stop microphone before moving
    if (isListeningRef.current) {
      stopVoiceInput();
    }

    // Save current answer
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] =
      answer;

    setAnswers(updatedAnswers);

    localStorage.setItem(
      "interviewAnswers",
      JSON.stringify(updatedAnswers)
    );

    // ==============================
    // Next Question
    // ==============================

    if (
      currentQuestion <
      totalQuestions - 1
    ) {
      const nextQuestion =
        currentQuestion + 1;

      setCurrentQuestion(nextQuestion);

      // Load previous answer if available
      setAnswer(
        updatedAnswers[nextQuestion] || ""
      );

      setVoiceError("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    // ==============================
    // Interview Completed
    // ==============================

    else {
      localStorage.setItem(
        "lastInterviewQuestion",
        questions[currentQuestion]
      );

      localStorage.setItem(
        "lastInterviewAnswer",
        answer
      );

      console.log(
        "✅ Interview completed"
      );

      console.log(
        "📦 Final answers:",
        updatedAnswers
      );

      navigate("/feedback");
    }
  };


  // ==============================
  // Exit Interview
  // ==============================

  const handleExit = () => {
    if (isListeningRef.current) {
      stopVoiceInput();
    }

    navigate("/dashboard");
  };


  // ==============================
  // UI
  // ==============================

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">

      <div className="mx-auto max-w-4xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex items-center justify-between">

          <div>
            <p className="text-sm font-medium text-indigo-400">
              AI MOCK INTERVIEW
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Interview Session
            </h1>
          </div>

          <button
            onClick={handleExit}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Exit Interview
          </button>

        </div>


        {/* ================= PROGRESS ================= */}

        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5">

          <div className="mb-3 flex items-center justify-between text-sm">

            <span className="text-slate-400">
              Question{" "}
              {currentQuestion + 1} of{" "}
              {totalQuestions}
            </span>

            <span className="font-medium text-indigo-400">
              {Math.round(progress)}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>


        {/* ================= QUESTION CARD ================= */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          {/* AI INTERVIEWER */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold">
              AI
            </div>

            <div>

              <p className="text-sm font-medium text-white">
                AI Interviewer
              </p>

              <p className="text-xs text-slate-500">
                Question{" "}
                {currentQuestion + 1}
              </p>

            </div>

          </div>


          {/* QUESTION */}

          <div className="mt-8">

            <p className="text-sm font-medium text-indigo-400">
              INTERVIEW QUESTION
            </p>

            <h2 className="mt-3 text-2xl font-semibold leading-relaxed">
              {questions[currentQuestion]}
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              Take your time and give a clear
              and confident answer.
            </p>

          </div>


          {/* ================= ANSWER ================= */}

          <div className="mt-8">

            <div className="mb-3 flex items-center justify-between">

              <label className="block text-sm font-medium">
                Your Answer
              </label>

              <span className="text-xs text-slate-500">
                {answer.length} characters
              </span>

            </div>


            {/* TEXTAREA */}

            <textarea
              value={answer}
              onChange={(event) =>
                handleAnswerChange(
                  event.target.value
                )
              }
              placeholder="Type your answer here..."
              rows={8}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
            />


            {/* ================= VOICE CONTROLS ================= */}

            <div className="mt-4 flex flex-wrap items-center gap-3">

              {!isListening ? (

                <button
                  type="button"
                  onClick={startVoiceInput}
                  className="flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-400 transition hover:bg-indigo-500/20 hover:text-indigo-300"
                >
                  🎤 Answer with Voice
                </button>

              ) : (

                <button
                  type="button"
                  onClick={stopVoiceInput}
                  className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                >
                  🛑 Stop Recording
                </button>

              )}

              {isListening && (
                <div className="flex items-center gap-2 text-sm text-green-400">

                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400" />

                  Listening...

                </div>
              )}

            </div>


            {/* ================= VOICE ERROR ================= */}

            {voiceError && (

              <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

                {voiceError}

              </div>

            )}

          </div>


          {/* ================= BOTTOM ================= */}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">

              💡 Tip: Be specific and explain
              your experience clearly.

            </p>


            <button
              onClick={handleNext}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500"
            >

              {currentQuestion ===
              totalQuestions - 1
                ? "Finish Interview"
                : "Next Question →"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Interview;