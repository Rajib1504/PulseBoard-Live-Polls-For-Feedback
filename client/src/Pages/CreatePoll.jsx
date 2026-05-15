import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import api from "../services/api";
import {
  Plus,
  Trash2,
  Send,
  ShieldCheck,
  Globe,
  HelpCircle,
  Asterisk,
} from "lucide-react";

export default function CreatePoll() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", isRequired: true, options: [{ text: "" }, { text: "" }] },
  ]);

  // question handlers
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", isRequired: true, options: [{ text: "" }, { text: "" }] },
    ]);
  };

  const removeQuestion = (qIndex) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const updateQuestion = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  // option handlers
  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "" });
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) return;
    updated[qIndex].options = updated[qIndex].options.filter(
      (_, i) => i !== oIndex
    );
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Poll title is required");
    if (!expiresAt) return toast.error("Expiry date is required");

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim())
        return toast.error(`Question ${i + 1} text is empty`);
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].text.trim())
          return toast.error(
            `Question ${i + 1}, Option ${j + 1} is empty`
          );
      }
    }

    setLoading(true);
    const toastId = toast.loading("Creating your poll...");
    try {
      const payload = {
        title: title.trim(),
        isAnonymous,
        isPublished: true,
        expiresAt: new Date(expiresAt).toISOString(),
        questions: questions.map((q) => ({
          text: q.text.trim(),
          isRequired: q.isRequired,
          options: q.options.map((o) => ({ text: o.text.trim() })),
        })),
      };
      await api.post("/Polls/create", payload);
      toast.success("Poll created successfully!", { id: toastId });
      navigate({ to: "/" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create poll", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-heading dark:text-white mb-2">
        Create a New Poll
      </h1>
      <p className="text-body dark:text-muted mb-8">
        Add your questions, set options, and share with your audience.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark p-6">
          <label className="block text-sm font-semibold text-heading dark:text-white mb-2">
            Poll Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Best Programming Language for DSA?"
            className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-transparent dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            maxLength={150}
          />

          {/* Settings Row */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {/* Anonymous Toggle */}
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                isAnonymous
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                  : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
              }`}
            >
              {isAnonymous ? (
                <ShieldCheck size={16} />
              ) : (
                <Globe size={16} />
              )}
              {isAnonymous ? "Anonymous Voting" : "Authenticated Voting"}
            </button>

            {/* Expiry */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-heading dark:text-slate-300">
                Expires:
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="px-3 py-2 rounded-xl border border-border dark:border-border-dark bg-transparent dark:text-white text-sm outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="bg-white dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-primary">
                Question {qIndex + 1}
              </span>
              <div className="flex items-center gap-2">
                {/* Required toggle */}
                <button
                  type="button"
                  onClick={() =>
                    updateQuestion(qIndex, "isRequired", !question.isRequired)
                  }
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    question.isRequired
                      ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                      : "bg-slate-50 dark:bg-slate-800 border-border dark:border-border-dark text-muted"
                  }`}
                  title={
                    question.isRequired
                      ? "Click to make optional"
                      : "Click to make required"
                  }
                >
                  {question.isRequired ? (
                    <Asterisk size={12} />
                  ) : (
                    <HelpCircle size={12} />
                  )}
                  {question.isRequired ? "Required" : "Optional"}
                </button>

                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              value={question.text}
              onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
              placeholder="Enter your question..."
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-transparent dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all mb-4"
            />

            {/* Options */}
            <div className="space-y-2 ml-4">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-border dark:border-border-dark flex-shrink-0" />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      updateOption(qIndex, oIndex, e.target.value)
                    }
                    placeholder={`Option ${oIndex + 1}`}
                    className="flex-1 px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-transparent dark:text-white text-sm outline-none focus:border-primary transition-all"
                  />
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="p-1 rounded text-muted hover:text-error transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium mt-1 transition-colors"
              >
                <Plus size={14} /> Add Option
              </button>
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <button
          type="button"
          onClick={addQuestion}
          className="w-full py-3 rounded-xl border-2 border-dashed border-border dark:border-border-dark hover:border-primary dark:hover:border-primary text-body dark:text-muted hover:text-primary font-medium transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add Question
        </button>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary disabled:opacity-50 shadow-lg shadow-primary/25 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Send size={18} />
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </form>
    </div>
  );
}
