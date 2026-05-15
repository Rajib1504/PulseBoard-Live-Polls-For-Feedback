import { useState, useEffect } from "react";
import { useParams, Link } from "@tanstack/react-router";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getDeviceId } from "../utils/fingerprint";
import CountdownTimer from "../components/CountdownTimer";
import {
  ShieldCheck,
  Globe,
  Fingerprint,
  CheckCircle2,
  Loader2,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import socket from "../services/socket";

export default function PollDetail() {
  const { pollId } = useParams({ strict: false });
  const { isAuthenticated } = useAuth();
  const { width, height } = useWindowSize();

  const [poll, setPoll] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await api.get(`/Polls/${pollId}`);
        setPoll(response.data.data.poll);
        setTotalVotes(response.data.data.totalVotes);
        
        // Check local storage for previous votes
        const savedVote = localStorage.getItem(`voted_${pollId}`);
        if (savedVote) {
          setSelectedOptions(JSON.parse(savedVote));
          setHasVoted(true);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load poll");
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();

    // Socket.io
    socket.connect();
    socket.emit("joinPollRoom", pollId);

    const handleVoteUpdate = () => {
      setTotalVotes((prev) => prev + 1);
    };

    socket.on("voteUpdated", handleVoteUpdate);

    return () => {
      socket.off("voteUpdated", handleVoteUpdate);
      socket.disconnect();
    };
  }, [pollId]);

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitVote = async () => {
    if (!poll) return;

    // validate required questions
    for (const q of poll.questions) {
      if (q.isRequired && !selectedOptions[q._id]) {
        return toast.error(`Please answer: "${q.text}"`);
      }
    }

    // check auth for non-anonymous polls
    if (!poll.isAnonymous && !isAuthenticated) {
      return toast.error("Please login to vote on this poll");
    }

    setSubmitting(true);
    const toastId = toast.loading("Submitting your vote...");
    try {
      const deviceId = await getDeviceId();
      const answers = Object.entries(selectedOptions).map(
        ([questionId, optionId]) => ({ questionId, optionId })
      );

      await api.post(`/response/${pollId}`, { deviceId, answers });
      toast.success("Vote submitted successfully! 🎉", { id: toastId });
      
      // Save vote locally to persist state
      localStorage.setItem(`voted_${pollId}`, JSON.stringify(selectedOptions));
      
      setHasVoted(true);
      setTotalVotes((prev) => prev + 1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit vote",
        { id: toastId }
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={48} className="mx-auto text-error mb-4" />
        <h2 className="text-xl font-bold text-heading dark:text-white">
          Poll not found
        </h2>
      </div>
    );
  }

  const isExpired = new Date() > new Date(poll.expiresAt);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header Card */}
      <div className="bg-white dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark overflow-hidden mb-6">
        <div className="h-1 bg-gradient-to-r from-primary to-accent" />
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {poll.isAnonymous ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                <ShieldCheck size={12} /> Anonymous
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                <Globe size={12} /> Authenticated
              </span>
            )}
            <CountdownTimer expiresAt={poll.expiresAt} />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold animate-pulse ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Live: {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-heading dark:text-white mb-1">
            {poll.title}
          </h1>
          <p className="text-sm text-muted">
            by {poll.creator?.name || "Unknown"}
          </p>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl bg-primary-50 dark:bg-primary/10 border border-primary/20">
        <Fingerprint size={16} className="text-primary" />
        <span className="text-xs font-medium text-primary dark:text-primary-light">
          Secured by Device Fingerprint — One vote per device
        </span>
      </div>

      {/* Voted Success Banner */}
      {hasVoted && (
        <div className="text-center py-6 px-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl mb-6 relative overflow-hidden">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
          />
          <div className="flex flex-col items-center justify-center relative z-10">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
              Your response has been recorded!
            </h2>
          </div>
        </div>
      )}

      {/* Expired State */}
      {isExpired && !hasVoted && (
        <div className="text-center py-12 bg-white dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark">
          <AlertCircle size={48} className="mx-auto text-error mb-4" />
          <h2 className="text-xl font-bold text-heading dark:text-white">
            This poll has expired
          </h2>
        </div>
      )}

      {/* Questions List (Voting Form or Read-Only) */}
      {!isExpired && (
        <div className="space-y-4">
          {poll.questions.map((question, qIndex) => (
            <div
              key={question._id}
              className="bg-white dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark p-6"
            >
              <div className="flex items-start gap-2 mb-4">
                <span className="text-sm font-bold text-primary mt-0.5">
                  Q{qIndex + 1}.
                </span>
                <div>
                  <h3 className="text-base font-semibold text-heading dark:text-white">
                    {question.text}
                  </h3>
                  <span
                    className={`text-xs ${question.isRequired ? "text-error" : "text-muted"}`}
                  >
                    {question.isRequired ? "* Required" : "Optional"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 ml-6">
                {question.options.map((option) => {
                  const isSelected =
                    selectedOptions[question._id] === option._id;
                  return (
                      <button
                        key={option._id}
                        type="button"
                        disabled={hasVoted}
                        onClick={() =>
                          !hasVoted && handleOptionSelect(question._id, option._id)
                        }
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all ${
                          isSelected
                            ? "border-primary bg-primary-50 dark:bg-primary/10 text-primary"
                            : "border-border dark:border-border-dark text-heading dark:text-slate-300"
                        } ${!hasVoted && !isSelected ? "hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800" : ""} ${hasVoted ? "opacity-90 cursor-default" : ""}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        {option.text}
                      </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Action Button: Submit OR View Results */}
          {hasVoted ? (
            <Link
              to={`/polls/${pollId}/results`}
              className="w-full py-4 rounded-xl text-primary font-bold bg-primary-50 hover:bg-primary-100 dark:bg-primary/10 dark:hover:bg-primary/20 dark:text-primary-light shadow-sm transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 border border-primary/20"
            >
              <BarChart3 size={20} /> View Public Results
            </Link>
          ) : (
            <button
              onClick={handleSubmitVote}
              disabled={submitting}
              className="w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary disabled:opacity-50 shadow-lg shadow-primary/25 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} /> Submit Vote
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
