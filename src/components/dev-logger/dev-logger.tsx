"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bug,
  X,
  Trash2,
  Pause,
  Play,
  ChevronDown,
  Search,
  Copy,
  Check,
  Terminal,
  Wifi,
} from "lucide-react";
import {
  useLoggerStore,
  LogEntry,
  isNetworkEntry,
} from "@/lib/dev-logger/logger-store";
import { patchConsole } from "@/lib/dev-logger/console-patch";
import { patchNetwork } from "@/lib/dev-logger/network-patch";

type FilterTab = "all" | "console" | "network" | "errors";

const LEVEL_COLOR: Record<string, string> = {
  log: "text-slate-300",
  info: "text-sky-300",
  warn: "text-amber-300",
  error: "text-red-300",
};

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const stringifyPretty = (value: unknown) => {
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const isEntryError = (entry: LogEntry) => {
  if (isNetworkEntry(entry)) {
    return Boolean(entry.error) || Boolean(entry.status && entry.status >= 400);
  }
  return entry.level === "error";
};

const EntryRow = ({ entry }: { entry: LogEntry }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const network = isNetworkEntry(entry);
  const isError = isEntryError(entry);

  const summary = network
    ? `${entry.method} ${entry.url}`
    : entry.message.split("\n")[0];

  const statusBadge = network
    ? entry.pending
      ? "…"
      : entry.error
        ? "ERR"
        : entry.status
    : null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const payload = isNetworkEntry(entry)
      ? JSON.stringify(
          {
            method: entry.method,
            url: entry.url,
            status: entry.status,
            requestBody: entry.requestBody,
            responseBody: entry.responseBody,
            error: entry.error,
          },
          null,
          2,
        )
      : entry.message;

    navigator.clipboard
      .writeText(payload)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  };

  return (
    <div
      className={`border-b border-white/5 px-3 py-2 text-xs transition hover:bg-white/5 ${
        isError ? "bg-red-500/5" : ""
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
        className="flex w-full cursor-pointer items-start gap-2 text-left"
      >
        {network ? (
          <Wifi className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300" />
        ) : (
          <Terminal
            className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${LEVEL_COLOR[entry.level]}`}
          />
        )}

        <span className="min-w-0 flex-1">
          <span
            className={`block truncate font-mono ${
              network ? "text-slate-200" : LEVEL_COLOR[entry.level]
            }`}
          >
            {summary}
          </span>
          <span className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-500">
            {formatTime(entry.timestamp)}
            {network && entry.duration !== undefined && (
              <span>· {entry.duration}ms</span>
            )}
          </span>
        </span>

        {statusBadge !== null && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              isError
                ? "bg-red-400/15 text-red-300"
                : "bg-emerald-400/15 text-emerald-300"
            }`}
          >
            {statusBadge}
          </span>
        )}

        <span className="relative shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
            aria-label="Copy entry"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-300" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>

          {copied && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] font-medium text-white shadow-lg shadow-black/40">
              Copied!
            </span>
          )}
        </span>

        <ChevronDown
          className={`mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {expanded && (
        <div className="mt-2 space-y-2 rounded-xl border border-white/10 bg-black/30 p-2">
          {network ? (
            <>
              {entry.requestBody !== undefined && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Request
                  </p>
                  <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-slate-300">
                    {stringifyPretty(entry.requestBody)}
                  </pre>
                </div>
              )}
              {entry.responseBody !== undefined && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Response
                  </p>
                  <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-slate-300">
                    {stringifyPretty(entry.responseBody)}
                  </pre>
                </div>
              )}
              {entry.error && (
                <p className="font-mono text-[11px] text-red-300">
                  {entry.error}
                </p>
              )}
            </>
          ) : (
            <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-slate-300">
              {entry.message}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export const DevLogger = () => {
  const { entries, paused, clear, togglePaused } = useLoggerStore();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    patchConsole();
    patchNetwork();
  }, []);

  const errorCount = useMemo(
    () => entries.filter(isEntryError).length,
    [entries],
  );

  const filtered = useMemo(() => {
    let list = entries;

    if (tab === "console") list = list.filter((e) => e.kind === "console");
    if (tab === "network") list = list.filter((e) => e.kind === "network");
    if (tab === "errors") list = list.filter(isEntryError);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) =>
        (isNetworkEntry(e) ? `${e.method} ${e.url}` : e.message)
          .toLowerCase()
          .includes(q),
      );
    }

    return list;
  }, [entries, tab, search]);

  const TABS: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "console", label: "Console" },
    { value: "network", label: "Network" },
    { value: "errors", label: "Errors" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-9999 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-950 text-cyan-300 shadow-2xl shadow-black/50 backdrop-blur-xl transition hover:bg-slate-900 active:scale-95"
        aria-label="Toggle dev logger"
      >
        <Bug className="h-5 w-5" />
        {errorCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {errorCount > 99 ? "99+" : errorCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-9999 flex h-125 w-95 max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/60 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_32%)]" />

          <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">Dev Logger</p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={togglePaused}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label={paused ? "Resume" : "Pause"}
              >
                {paused ? (
                  <Play className="h-3.5 w-3.5" />
                ) : (
                  <Pause className="h-3.5 w-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={clear}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Clear logs"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close dev logger"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-1 border-b border-white/10 px-3 py-2">
            {TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                  tab === t.value
                    ? "bg-cyan-400/15 text-cyan-200"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative z-10 border-b border-white/10 px-3 py-2">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5">
              <Search className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter logs..."
                className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="relative z-10 flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-slate-500">
                {paused ? "Logging paused" : "No logs yet"}
              </p>
            ) : (
              filtered.map((entry) => <EntryRow key={entry.id} entry={entry} />)
            )}
          </div>
        </div>
      )}
    </>
  );
};
