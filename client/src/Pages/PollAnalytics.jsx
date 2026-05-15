import { useState, useEffect } from "react";
import { useParams, Link } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  Users,
  Eye,
  EyeOff,
  Clock,
  Loader2,
  Share2,
} from "lucide-react";
import api from "../services/api";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function PollAnalytics() {
  const { pollId } = useParams({ strict: false });
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get(`/Polls/${pollId}/analytics`);
        setData(response.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchAnalytics();

    // Socket.io Real-time Connection
    if (isAuthenticated) {
      socket.connect();
      socket.emit("joinPollRoom", pollId);

      const handleVoteUpdate = () => {
        toast("New live vote received!", {
          icon: "📈",
          style: {
            borderRadius: "10px",
            background: "#1e293b",
            color: "#fff",
          },
        });
        fetchAnalytics(); // Refresh charts
      };

      socket.on("voteUpdated", handleVoteUpdate);

      return () => {
        socket.off("voteUpdated", handleVoteUpdate);
        socket.disconnect();
      };
    }
  }, [pollId, isAuthenticated]);

  const togglePublish = async () => {
    setToggling(true);
    const toastId = toast.loading("Updating visibility...");
    try {
      const response = await api.patch(`/Polls/${pollId}/publish`);
      setData((prev) => ({
        ...prev,
        poll: {
          ...prev.poll,
          isResultPublished: response.data.data.isResultPublished,
        },
      }));
      toast.success(
        `Results are now ${
          response.data.data.isResultPublished ? "public" : "private"
        }`,
        { id: toastId }
      );
    } catch (error) {
      toast.error("Failed to update visibility", { id: toastId });
    } finally {
      setToggling(false);
    }
  };

  const copyResultsLink = () => {
    const url = `${window.location.origin}/polls/${pollId}/results`;
    navigator.clipboard.writeText(url);
    toast.success("Public results link copied!");
  };

  if (!isAuthenticated) return null; // handled by parent/redirect

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const { poll, totalResponses, questionSummaries } = data;
  const isExpired = new Date() > new Date(poll.expiresAt);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/my-polls"
          className="p-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-muted hover:text-heading dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-heading dark:text-white leading-tight">
            Analytics: {poll.title}
          </h1>
          <div className="flex items-center gap-3 mt-1.5 text-sm font-medium text-muted">
            <span
              className={`inline-flex items-center gap-1 ${
                isExpired ? "text-error" : "text-emerald-500"
              }`}
            >
              <Clock size={14} /> {isExpired ? "Expired" : "Active"}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Users size={14} /> {totalResponses} Total Responses
            </span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-heading dark:text-white mb-1">
            Visibility & Sharing
          </h3>
          <p className="text-sm text-body dark:text-muted">
            Control whether the public can see these results.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {poll.isResultPublished && (
            <button
              onClick={copyResultsLink}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-primary/30 bg-primary-50 dark:bg-primary/10 text-primary dark:text-primary-light font-medium hover:bg-primary/10 transition-colors"
            >
              <Share2 size={18} /> Copy Results Link
            </button>
          )}
          <button
            onClick={togglePublish}
            disabled={toggling}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all shadow-md hover:shadow-lg ${
              poll.isResultPublished
                ? "bg-slate-800 hover:bg-slate-700"
                : "bg-emerald-500 hover:bg-emerald-600"
            } disabled:opacity-70`}
          >
            {toggling ? (
              <Loader2 size={18} className="animate-spin" />
            ) : poll.isResultPublished ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
            {poll.isResultPublished ? "Make Private" : "Publish Results"}
          </button>
        </div>
      </div>

      {/* Question Summaries */}
      <div className="space-y-6">
        {questionSummaries.map((q, qIndex) => (
          <div
            key={q.questionId}
            className="bg-white dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark p-6"
          >
            <div className="mb-6">
              <span className="text-sm font-bold text-primary">
                Question {qIndex + 1}
              </span>
              <h3 className="text-xl font-semibold text-heading dark:text-white mt-1">
                {q.text}
              </h3>
              <p className="text-sm text-muted mt-1">
                {q.totalVotes} responses
              </p>
            </div>

            {/* Chart */}
            {q.totalVotes > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={q.options}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="text"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      width={150}
                      tick={{ fill: "#64748b", fontSize: 13 }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        backgroundColor: "#ffffff",
                        color: "#0f172a",
                      }}
                      formatter={(value, name, props) => [
                        `${value} votes (${props.payload.percentage}%)`,
                        "Votes",
                      ]}
                    />
                    <Bar
                      dataKey="votes"
                      radius={[0, 4, 4, 0]}
                      barSize={32}
                      animationDuration={1500}
                    >
                      {q.options.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-border dark:border-border-dark">
                <p className="text-muted text-sm font-medium">
                  No responses yet
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
