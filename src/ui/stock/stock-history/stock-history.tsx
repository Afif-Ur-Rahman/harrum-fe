"use client";

import { useState, useCallback, useMemo } from "react";
import { getStockHistory } from "@/api/api-call/stock";
import { formatDateTime, formatPrice } from "@/utils";
import { Pagination } from "@/components";
import Loader from "@/components/ui/loader";
import Nodata from "@/components/ui/nodata";
import { ArrowDownToLine, ArrowUpFromLine, ShoppingBag, History, ChevronDown, User } from "lucide-react";
import { usePersistStore } from "@/store/presistStore";

type HistoryEntry = {
  stockId: string;
  stockName: string;
  unit: string;
  quantity: number;
  price: number;
  type: "stock-in" | "wastage" | "order";
  reason?: string;
  date: string;
  createdByName: string;
  historyId: string;
};

type Session = {
  key: string;
  type: HistoryEntry["type"];
  date: string;
  createdByName: string;
  items: HistoryEntry[];
  totalValue: number;
};

type TypeFilter = "all" | "stock-in" | "wastage" | "order";

const TYPE_TABS: { value: TypeFilter; label: string; icon: React.ElementType | null }[] = [
  { value: "all",      label: "All",         icon: null },
  { value: "stock-in", label: "Stock In",    icon: ArrowDownToLine },
  { value: "wastage",  label: "Wastage",     icon: ArrowUpFromLine },
  { value: "order",    label: "Order Usage", icon: ShoppingBag },
];

const TYPE_STYLE: Record<string, { badge: string; row: string }> = {
  "stock-in": { badge: "bg-emerald-100 text-emerald-700", row: "border-l-emerald-400" },
  wastage:    { badge: "bg-red-100 text-red-700",         row: "border-l-red-400"     },
  order:      { badge: "bg-amber-100 text-amber-700",     row: "border-l-amber-400"   },
};

const SESSIONS_PER_PAGE = 15;

// Group flat entries into sessions: same person + same minute + same type
function buildSessions(entries: HistoryEntry[]): Session[] {
  const map = new Map<string, Session>();

  for (const entry of entries) {
    const minute = new Date(entry.date).toISOString().slice(0, 16); // "2025-04-28T10:23"
    const key = `${entry.createdByName}_${minute}_${entry.type}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        type: entry.type,
        date: entry.date,
        createdByName: entry.createdByName,
        items: [],
        totalValue: 0,
      });
    }
    const session = map.get(key)!;
    session.items.push(entry);
    session.totalValue += Math.abs(entry.quantity) * (entry.price ?? 0);
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export const StockHistory = () => {
  const { user } = usePersistStore();
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo] = useState(today);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchHistory = useCallback(async (t = typeFilter, f = from, toDate = to) => {
    setLoading(true);
    setExpandedKey(null);
    setPage(1);
    const res = await getStockHistory({ from: f, to: toDate, type: t, page: 1, limit: 500 });
    const payload = res?.data?.data;
    setEntries(payload?.entries ?? []);
    setSearched(true);
    setLoading(false);
  }, [typeFilter, from, to]);

  const handleSearch = () => fetchHistory();

  const handleTypeChange = (t: TypeFilter) => {
    setTypeFilter(t);
    if (searched) fetchHistory(t);
  };

  const allSessions = useMemo(() => buildSessions(entries), [entries]);

  const totalPages = Math.ceil(allSessions.length / SESSIONS_PER_PAGE);
  const pagedSessions = useMemo(() => {
    const start = (page - 1) * SESSIONS_PER_PAGE;
    return allSessions.slice(start, start + SESSIONS_PER_PAGE);
  }, [allSessions, page]);

  const stockInCount = entries.filter((e) => e.type === "stock-in").length;
  const wastageCount = entries.filter((e) => e.type === "wastage").length;
  const orderCount   = entries.filter((e) => e.type === "order").length;

  return (
    <div className="pb-12 mt-12.5 md:mt-6.25 lg:mt-7.5">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Stock History</h1>
          {searched && !loading && (
            <p className="text-sm text-gray-400 mt-1">
              {allSessions.length} batch{allSessions.length !== 1 ? "es" : ""} · {entries.length} entr{entries.length !== 1 ? "ies" : "y"}
            </p>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-5 space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 transition active:scale-[0.97] disabled:opacity-50"
          >
            {loading ? "Loading…" : "Search"}
          </button>
        </div>

        {/* Type tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {TYPE_TABS.map((tab) => {
            const isActive = typeFilter === tab.value;
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => handleTypeChange(tab.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary cards */}
      {searched && !loading && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wide mb-1">Stock In</p>
            <p className="text-2xl font-bold text-emerald-700">{stockInCount}</p>
            <p className="text-xs text-emerald-400 mt-0.5">entries</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">Wastage</p>
            <p className="text-2xl font-bold text-red-600">{wastageCount}</p>
            <p className="text-xs text-red-300 mt-0.5">entries</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide mb-1">Order Usage</p>
            <p className="text-2xl font-bold text-amber-700">{orderCount}</p>
            <p className="text-xs text-amber-400 mt-0.5">entries</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!searched ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <History className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Select a date range</h3>
          <p className="text-sm text-gray-400">Choose dates above and press Search to view history.</p>
        </div>
      ) : loading ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 flex justify-center">
          <Loader />
        </div>
      ) : allSessions.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 flex justify-center">
          <Nodata />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            {pagedSessions.map((session) => {
              const isOpen = expandedKey === session.key;
              const style = TYPE_STYLE[session.type] ?? TYPE_STYLE["stock-in"];
              const typeLabel = TYPE_TABS.find((t) => t.value === session.type)?.label ?? session.type;

              return (
                <div
                  key={session.key}
                  className={`bg-white border border-gray-100 border-l-4 ${style.row} rounded-2xl shadow-sm overflow-hidden`}
                >
                  {/* Session row */}
                  <div
                    onClick={() => setExpandedKey(isOpen ? null : session.key)}
                    className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors ${isOpen ? "bg-gray-50" : "hover:bg-gray-50/60"}`}
                  >
                    {/* Type badge */}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${style.badge}`}>
                      {typeLabel}
                    </span>

                    {/* Date + by */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{formatDateTime(session.date)}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-400">{session.createdByName || "—"}</p>
                      </div>
                    </div>

                    {/* Item count */}
                    <div className="text-center shrink-0">
                      <p className="text-lg font-bold text-gray-900">{session.items.length}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">item{session.items.length !== 1 ? "s" : ""}</p>
                    </div>

                    {/* Total value */}
                    {session.totalValue > 0 && (
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">{formatPrice(session.totalValue)}</p>
                        <p className="text-xs text-gray-400">{user?.currency || ""}</p>
                      </div>
                    )}

                    {/* Reason badge (for order/wastage with single reason) */}
                    {session.items[0]?.reason && session.items.every((i) => i.reason === session.items[0].reason) && (
                      <span className="hidden md:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 shrink-0">
                        {session.items[0].reason}
                      </span>
                    )}

                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Expanded items */}
                  {isOpen && (
                    <div className="border-t border-gray-100 px-4 py-3 space-y-1">
                      <div className="bg-gray-50 rounded-xl overflow-hidden">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Items</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {session.items.map((item) => (
                            <div key={item.historyId} className="flex items-center gap-3 px-4 py-2.5">
                              <p className="flex-1 text-sm font-medium text-gray-900">{item.stockName}</p>
                              {item.reason && item.reason !== session.items[0]?.reason && (
                                <span className="text-xs text-amber-600 font-medium hidden sm:block">{item.reason}</span>
                              )}
                              <span className="text-xs text-gray-400 hidden sm:block">
                                {item.price > 0 && item.quantity > 0 ? `${formatPrice(item.price)}/unit` : ""}
                              </span>
                              <span className={`text-sm font-bold shrink-0 ${item.quantity < 0 ? "text-red-600" : "text-emerald-600"}`}>
                                {item.quantity > 0 ? "+" : ""}{item.quantity} {item.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Session total */}
                        {session.totalValue > 0 && (
                          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-white/60">
                            <span className="text-xs text-gray-400">{session.items.length} item{session.items.length !== 1 ? "s" : ""}</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatPrice(session.totalValue)}
                              <span className="text-xs font-normal text-gray-400 ml-1">{user?.currency || ""}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); setExpandedKey(null); }} />
        </div>
      )}
    </div>
  );
};
