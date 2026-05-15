import { useState, useEffect } from "react";
import { Search, BarChart3 } from "lucide-react";
import api from "../../services/api";
import PollCard from "../PollCard";

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-card-dark rounded-3xl border border-border dark:border-border-dark p-6 animate-pulse shadow-sm">
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
      </div>
      <div className="h-7 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
      <div className="h-5 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="flex justify-between mt-6 pt-4 border-t border-border dark:border-border-dark">
        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  );
}

export default function ActivePollsGrid() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await api.get("/Polls");
        setPolls(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch polls:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  const filteredPolls = polls.filter((poll) =>
    poll.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-20 max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-heading dark:text-white mb-2">
            🔥 Live Public Polls
          </h2>
          <p className="text-body dark:text-muted">
            Vote on trending topics from the community.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Search active polls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-border dark:border-border-dark bg-white dark:bg-card-dark text-heading dark:text-white text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && filteredPolls.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => (
            <PollCard key={poll._id} poll={poll} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredPolls.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-border dark:border-border-dark">
          <div className="w-20 h-20 rounded-3xl bg-white dark:bg-card-dark shadow-sm flex items-center justify-center mx-auto mb-5">
            <BarChart3 size={32} className="text-muted" />
          </div>
          <h3 className="text-xl font-bold text-heading dark:text-white mb-2">
            {searchQuery ? "No matches found" : "No active polls yet"}
          </h3>
          <p className="text-body dark:text-muted max-w-sm mx-auto">
            {searchQuery
              ? "We couldn't find any polls matching your search."
              : "Be the trendsetter! Create the very first poll right now."}
          </p>
        </div>
      )}
    </section>
  );
}
