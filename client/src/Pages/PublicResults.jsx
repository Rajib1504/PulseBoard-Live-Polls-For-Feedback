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
  AlertCircle,
  Loader2,
  Share2,
  Download,
} from "lucide-react";
import api from "../services/api";
import socket from "../services/socket";
import toast from "react-hot-toast";
import { toPng } from "html-to-image";
import ShareModal from "../components/ShareModal";

const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function PublicResults() {
  const { pollId } = useParams({ strict: false });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/Polls/${pollId}/results`);
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();

    // Socket.io Real-time Connection
    socket.connect();
    socket.emit("joinPollRoom", pollId);

    const handleVoteUpdate = () => {
      // Refresh results silently
      fetchResults();
    };

    socket.on("voteUpdated", handleVoteUpdate);

    return () => {
      socket.off("voteUpdated", handleVoteUpdate);
      socket.disconnect();
    };
  }, [pollId]);

  const handleShareClick = () => {
    setIsShareOpen(true);
  };

  const exportToImage = async () => {
    const element = document.getElementById("poll-results-container");
    if (!element) return;
    
    setIsExporting(true);
    const toastId = toast.loading("Generating image...");
    
    try {
      // Small delay to ensure any re-renders are complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(element, {
        cacheBust: true,
        backgroundColor: document.documentElement.classList.contains("dark") ? "#0f172a" : "#f8fafc",
        pixelRatio: 2,
        filter: (node) => {
          // Ignore buttons and share UI during export
          if (node.hasAttribute && node.hasAttribute("data-html2canvas-ignore")) {
            return false;
          }
          return true;
        }
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Poll-Results-${pollId}.png`;
      link.click();
      
      toast.success("Image exported successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to export image", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 animate-fade-in max-w-lg mx-auto">
        <AlertCircle size={48} className="mx-auto text-error mb-4" />
        <h2 className="text-2xl font-bold text-heading dark:text-white mb-2">
          {error}
        </h2>
        <p className="text-body dark:text-muted mb-6">
          This usually means the poll creator hasn't published the results yet,
          or the poll doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const { poll, totalResponses, questionSummaries } = data;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div id="poll-results-container" className="p-4 sm:p-6 -m-4 sm:-m-6">
        {/* Header Card */}
        <div className="bg-white dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark overflow-hidden mb-8 shadow-sm">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                Public Results
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-heading dark:text-white leading-tight mb-2">
                {poll.title}
              </h1>
              <div className="flex items-center gap-4 text-sm font-medium text-muted">
                <span>by {poll.creator?.name || "Unknown"}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Users size={16} /> {totalResponses} Total Responses
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0" data-html2canvas-ignore>
              <button
                onClick={exportToImage}
                disabled={isExporting}
                className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-card-dark text-heading dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
              >
                {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                Export Image
              </button>
              <button
                onClick={handleShareClick}
                className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-sm"
              >
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Question Summaries */}
        <div className="space-y-6">
        {questionSummaries.map((q, qIndex) => (
          <div
            key={q.questionId}
            className="bg-white dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark p-6 shadow-sm"
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

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={window.location.href}
        title={poll.title}
      />
    </div>
  );
}
