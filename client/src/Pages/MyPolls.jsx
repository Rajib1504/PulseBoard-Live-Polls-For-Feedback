import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Clock,
  Users,
  ArrowRight,
  Loader2,
  Link2,
  Copy,
  PlayCircle,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function MyPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMyPolls = async () => {
      try {
        const response = await api.get("/Polls/my-polls");
        setPolls(response.data.data || []);
      } catch (error) {
        toast.error("Failed to load your polls");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchMyPolls();
  }, [isAuthenticated]);

  const copyToClipboard = (pollId) => {
    const url = `${window.location.origin}/polls/${pollId}`;
    navigator.clipboard.writeText(url);
    toast.success("Poll link copied to clipboard!");
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <h2 className="text-2xl font-bold text-heading dark:text-white mb-4">
          Please login to view your polls
        </h2>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Go to Login <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-heading dark:text-white mb-2">
            My Polls
          </h1>
          <p className="text-body dark:text-muted">
            Manage your polls and view analytics.
          </p>
        </div>
        <Link
          to="/polls/create"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          + Create New
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-card-dark rounded-3xl border border-border dark:border-border-dark">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={28} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold text-heading dark:text-white mb-2">
            You haven't created any polls yet
          </h3>
          <p className="text-body dark:text-muted mb-6">
            Create your first poll to start collecting feedback.
          </p>
          <Link
            to="/polls/create"
            className="inline-flex px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
          >
            Create First Poll
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {polls.map((poll) => {
            const isExpired = new Date() > new Date(poll.expiresAt);
            return (
              <div
                key={poll._id}
                className="group bg-white dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark p-5 hover:border-primary/30 dark:hover:border-primary/30 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isExpired
                          ? "bg-red-50 dark:bg-red-950/30 text-error"
                          : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      <Clock size={12} />
                      {isExpired ? "Expired" : "Active"}
                    </span>
                    {poll.isResultPublished && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                        <Link2 size={12} /> Results Public
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-heading dark:text-white mb-1 group-hover:text-primary transition-colors">
                    {poll.title?.length > 70 ? poll.title.substring(0, 70) + '...' : poll.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1.5">
                      <Users size={14} /> {poll.responseCount} Responses
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {new Date(poll.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(poll._id)}
                    className="p-2.5 rounded-xl border border-border dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-muted hover:text-heading dark:hover:text-white transition-colors"
                    title="Copy Poll Link"
                  >
                    <Copy size={18} />
                  </button>
                  <Link
                    to={`/polls/${poll._id}`}
                    className="p-2.5 rounded-xl border border-border dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-muted hover:text-primary transition-colors"
                    title="View Poll"
                  >
                    <PlayCircle size={18} />
                  </Link>
                  <Link
                    to={`/polls/${poll._id}/analytics`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-50 dark:bg-primary/10 text-primary dark:text-primary-light font-medium hover:bg-primary hover:text-white transition-colors"
                  >
                    <BarChart3 size={18} /> Analytics
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
