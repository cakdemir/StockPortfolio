"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Holding = {
  ticker: string;
  name: string;
  allocation: number;
  price: number;
  change: number;
  color: string;
};

type NewsItem = {
  id: string;
  headline: string;
  source: string;
  summary: string;
  url: string;
  publishedAt: string;
  sentiment: "positive" | "neutral" | "cautious";
};

type ShareCardProps = {
  name: string;
  summary: string;
  holdings: Holding[];
};

const AVAILABLE_STOCKS: Omit<Holding, "allocation">[] = [
  {
    ticker: "AAPL",
    name: "Apple",
    price: 214.32,
    change: 1.2,
    color: "#0052FF",
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    price: 467.18,
    change: 0.8,
    color: "#4F7CFF",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA",
    price: 1124.36,
    change: 3.1,
    color: "#7BA3FF",
  },
  {
    ticker: "GOOGL",
    name: "Alphabet",
    price: 177.89,
    change: -0.4,
    color: "#8FBCFF",
  },
  {
    ticker: "AMZN",
    name: "Amazon",
    price: 186.42,
    change: 0.6,
    color: "#A8C9FF",
  },
  {
    ticker: "META",
    name: "Meta",
    price: 501.73,
    change: 1.7,
    color: "#C7DBFF",
  },
];

const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    headline: "Big Tech leads market momentum into the close",
    source: "Market Wire",
    summary:
      "Mega-cap names continued to lead while investors rotated into AI-linked equities.",
    url: "#",
    publishedAt: "10m ago",
    sentiment: "positive",
  },
  {
    id: "2",
    headline: "Analysts highlight resilient cloud spending",
    source: "Street Signals",
    summary:
      "Enterprise software and cloud budgets remain constructive despite macro caution.",
    url: "#",
    publishedAt: "32m ago",
    sentiment: "neutral",
  },
  {
    id: "3",
    headline: "Semiconductor demand outlook remains mixed",
    source: "Global Finance",
    summary:
      "Chip demand remains strong in AI infrastructure, while consumer hardware is recovering gradually.",
    url: "#",
    publishedAt: "1h ago",
    sentiment: "cautious",
  },
];

const STARTER_PORTFOLIO: Holding[] = [
  { ...AVAILABLE_STOCKS[0], allocation: 28 },
  { ...AVAILABLE_STOCKS[1], allocation: 22 },
  { ...AVAILABLE_STOCKS[2], allocation: 20 },
  { ...AVAILABLE_STOCKS[3], allocation: 12 },
  { ...AVAILABLE_STOCKS[4], allocation: 10 },
  { ...AVAILABLE_STOCKS[5], allocation: 8 },
];

const shareCopy =
  "I just built my stock portfolio on Castfolio. See the allocations, latest market headlines, and build your own portfolio card.";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function totalAllocation(holdings: Holding[]) {
  return holdings.reduce((sum, item) => sum + item.allocation, 0);
}

function estimatedPortfolioValue(holdings: Holding[], budget = 10000) {
  return holdings.reduce(
    (sum, item) => sum + (budget * item.allocation) / 100,
    0,
  );
}

function sentimentTone(sentiment: NewsItem["sentiment"]) {
  if (sentiment === "positive") {
    return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30";
  }

  if (sentiment === "cautious") {
    return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30";
  }

  return "bg-white/10 text-slate-200 ring-1 ring-white/10";
}

function MiniAppBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
      <span className="h-2 w-2 rounded-full bg-[#0052FF]" />
      Farcaster Miniapp + Base ready
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7BA3FF]">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  helpText,
}: {
  label: string;
  value: string;
  helpText: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helpText}</p>
    </div>
  );
}

function AllocationPieCard({ holdings }: { holdings: Holding[] }) {
  const [chartReady, setChartReady] = useState(false);
  const hasData = holdings.length > 0 && totalAllocation(holdings) > 0;

  useEffect(() => {
    setChartReady(true);
  }, []);

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0E1628] p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-200">
            Allocation overview
          </p>
          <p className="text-xs text-slate-400">
            Recharts-backed portfolio composition
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center text-sm text-slate-400">
          Add positions to visualize your portfolio mix.
        </div>
      ) : !chartReady ? (
        <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] text-center text-sm text-slate-400">
          Preparing chart…
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={holdings}
                  dataKey="allocation"
                  nameKey="ticker"
                  innerRadius={72}
                  outerRadius={100}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {holdings.map((holding) => (
                    <Cell key={holding.ticker} fill={holding.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#081120",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`${String(value)}%`, "Allocation"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {holdings.map((holding) => (
              <div
                key={holding.ticker}
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: holding.color }}
                  />
                  <div>
                    <p className="font-medium text-white">{holding.ticker}</p>
                    <p className="text-xs text-slate-400">{holding.name}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-100">
                  {holding.allocation}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NewsFeed({
  items,
  loading,
  error,
}: {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-4"
          >
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="mt-4 h-5 w-3/4 rounded bg-white/10" />
            <div className="mt-3 h-4 w-full rounded bg-white/10" />
            <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5 text-sm text-amber-100">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
        No market headlines available yet. We'll show stock news once your
        portfolio is populated.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.url}
          className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-[#0052FF]/50 hover:bg-white/10"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {item.source}
            </p>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${sentimentTone(item.sentiment)}`}
            >
              {item.sentiment}
            </span>
          </div>
          <h3 className="mt-3 text-base font-semibold text-white">
            {item.headline}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {item.summary}
          </p>
          <p className="mt-4 text-xs text-slate-500">{item.publishedAt}</p>
        </a>
      ))}
    </div>
  );
}

function ShareCard({ name, summary, holdings }: ShareCardProps) {
  const topHoldings = holdings.slice(0, 3);

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(0,82,255,0.35),_transparent_40%),linear-gradient(180deg,#111B31_0%,#081120_100%)] p-6 shadow-[0_20px_80px_rgba(0,82,255,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#9DBDFF]">
            Castfolio
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{name}</h3>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
          Share-ready
        </div>
      </div>

      <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
        {summary}
      </p>

      <div className="mt-8 grid gap-3">
        {topHoldings.map((holding) => (
          <div
            key={holding.ticker}
            className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: holding.color }}
              />
              <span className="font-medium text-white">{holding.ticker}</span>
            </div>
            <span className="text-sm text-slate-200">{holding.allocation}%</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-400">
        <span>Built for Farcaster & Base</span>
        <span>castfolio.app</span>
      </div>
    </div>
  );
}

function HoldingEditor({
  holding,
  onAllocationChange,
  onRemove,
}: {
  holding: Holding;
  onAllocationChange: (ticker: string, value: number) => void;
  onRemove: (ticker: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: holding.color }}
            />
            <p className="text-base font-semibold text-white">{holding.ticker}</p>
          </div>
          <p className="mt-1 text-sm text-slate-400">{holding.name}</p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(holding.ticker)}
          className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          Remove
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Allocation
          </span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={holding.allocation}
            onChange={(event) =>
              onAllocationChange(holding.ticker, Number(event.target.value))
            }
            className="w-full accent-[#0052FF]"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Weight
          </span>
          <input
            type="number"
            min="0"
            max="100"
            value={holding.allocation}
            onChange={(event) =>
              onAllocationChange(holding.ticker, Number(event.target.value))
            }
            className="w-full rounded-2xl border border-white/10 bg-[#081120] px-4 py-3 text-white outline-none transition focus:border-[#0052FF] sm:w-24"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-400">{formatCurrency(holding.price)}</span>
        <span
          className={holding.change >= 0 ? "text-emerald-300" : "text-rose-300"}
        >
          {formatPercent(holding.change)}
        </span>
      </div>
    </div>
  );
}

function ShareActions({
  onShare,
  onCopy,
  isMiniApp,
}: {
  onShare: () => void;
  onCopy: () => void;
  isMiniApp: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onShare}
        className="inline-flex items-center justify-center rounded-full bg-[#0052FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E63FF]"
      >
        {isMiniApp ? "Share to Farcaster" : "Simulate Farcaster share"}
      </button>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
      >
        Copy share text
      </button>
    </div>
  );
}

export default function Home() {
  const [portfolioName, setPortfolioName] = useState("Base Growth Basket");
  const [summary, setSummary] = useState(
    "A high-conviction tech portfolio built for sharing inside Farcaster.",
  );
  const [holdings, setHoldings] = useState<Holding[]>(STARTER_PORTFOLIO);
  const [selectedTicker, setSelectedTicker] = useState("META");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    const isEmbedded =
      typeof window !== "undefined" &&
      (window.location.search.includes("miniApp=true") ||
        window.location.search.includes("miniapp=true"));

    setIsMiniApp(isEmbedded);

    const timer = window.setTimeout(() => {
      setNews(MOCK_NEWS);
      setNewsLoading(false);
    }, 800);

    return () => window.clearTimeout(timer);
  }, []);

  const allocation = useMemo(() => totalAllocation(holdings), [holdings]);
  const remaining = Math.max(0, 100 - allocation);
  const portfolioValue = useMemo(
    () => estimatedPortfolioValue(holdings),
    [holdings],
  );

  function addHolding() {
    const stock = AVAILABLE_STOCKS.find((item) => item.ticker === selectedTicker);

    if (!stock) {
      return;
    }

    if (holdings.some((item) => item.ticker === stock.ticker)) {
      setStatusMessage(`${stock.ticker} is already in your portfolio.`);
      return;
    }

    setHoldings((current) => [...current, { ...stock, allocation: 0 }]);
    setStatusMessage(`${stock.ticker} added to your portfolio.`);
  }

  function updateAllocation(ticker: string, value: number) {
    const normalizedValue = Number.isNaN(value)
      ? 0
      : Math.min(100, Math.max(0, value));

    setHoldings((current) =>
      current.map((item) =>
        item.ticker === ticker ? { ...item, allocation: normalizedValue } : item,
      ),
    );
  }

  function removeHolding(ticker: string) {
    setHoldings((current) => current.filter((item) => item.ticker !== ticker));
    setStatusMessage(`${ticker} removed from your portfolio.`);
  }

  async function copyShareText() {
    try {
      await navigator.clipboard.writeText(
        `${shareCopy}\n\n${portfolioName} — ${summary}`,
      );
      setStatusMessage("Share text copied.");
    } catch {
      setStatusMessage("Clipboard unavailable. Copy manually from preview.");
    }
  }

  function sharePortfolio() {
    setStatusMessage(
      isMiniApp
        ? "Miniapp share flow can be connected to the Farcaster SDK composer."
        : "Browser mode preview: connect this button to the Farcaster share composer in production.",
    );
  }

  const validationMessage =
    allocation === 100
      ? "Allocation is balanced and ready to share."
      : allocation > 100
        ? `Allocation is ${allocation}%. Reduce by ${allocation - 100}% to continue.`
        : `Allocation is ${allocation}%. Add ${remaining}% to reach 100%.`;

  return (
    <div className="min-h-screen bg-[#050B14] text-white">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(0,82,255,0.28),_transparent_42%),linear-gradient(180deg,#0D1526_0%,#081120_100%)] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <MiniAppBadge />
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Build and share stock portfolios for Farcaster.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                  Castfolio turns simple allocations into polished, mobile-first
                  portfolio cards with stock headlines, Base-native design, and
                  Miniapp-ready sharing flows.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#builder"
                  className="inline-flex items-center justify-center rounded-full bg-[#0052FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E63FF]"
                >
                  Build portfolio
                </a>
                <a
                  href="/api/miniapp/manifest"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                >
                  View miniapp manifest
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard
                  label="Mode"
                  value={isMiniApp ? "Miniapp" : "Browser"}
                  helpText="Works standalone and in embedded contexts."
                />
                <StatCard
                  label="Portfolio value"
                  value={formatCurrency(portfolioValue)}
                  helpText="Mock budget visualization for the current mix."
                />
                <StatCard
                  label="Holdings"
                  value={`${holdings.length}`}
                  helpText="Curated large-cap basket for fast onboarding."
                />
              </div>
            </div>

            <ShareCard
              name={portfolioName}
              summary={summary}
              holdings={holdings}
            />
          </div>
        </section>

        <section
          id="builder"
          className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start"
        >
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Portfolio Builder"
              title="Create your first shareable allocation"
              description="Start with a mobile-first editor, adjust weights, and keep wallet connection optional until you need ownership or persistence."
            />

            <div className="rounded-[28px] border border-white/10 bg-[#0A1222] p-4 sm:p-6">
              <div className="grid gap-4">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Portfolio name
                  </span>
                  <input
                    value={portfolioName}
                    onChange={(event) => setPortfolioName(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#081120] px-4 py-3 text-white outline-none transition focus:border-[#0052FF]"
                    placeholder="Base Growth Basket"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Summary
                  </span>
                  <textarea
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    className="min-h-28 w-full rounded-2xl border border-white/10 bg-[#081120] px-4 py-3 text-white outline-none transition focus:border-[#0052FF]"
                    placeholder="Tell people what makes this portfolio interesting."
                  />
                </label>

                <div className="grid gap-3 rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[1fr_auto]">
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Add ticker
                    </span>
                    <select
                      value={selectedTicker}
                      onChange={(event) => setSelectedTicker(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#081120] px-4 py-3 text-white outline-none transition focus:border-[#0052FF]"
                    >
                      {AVAILABLE_STOCKS.map((stock) => (
                        <option key={stock.ticker} value={stock.ticker}>
                          {stock.ticker} — {stock.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={addHolding}
                    className="inline-flex items-center justify-center self-end rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#081120] transition hover:bg-slate-200"
                  >
                    Add position
                  </button>
                </div>

                <div className="grid gap-4">
                  {holdings.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                      No holdings yet. Add a ticker to begin building your
                      portfolio.
                    </div>
                  ) : (
                    holdings.map((holding) => (
                      <HoldingEditor
                        key={holding.ticker}
                        holding={holding}
                        onAllocationChange={updateAllocation}
                        onRemove={removeHolding}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <AllocationPieCard holdings={holdings} />

            <div className="rounded-[28px] border border-white/10 bg-[#0A1222] p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-100">
                    Portfolio dashboard
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Summary, validation, optional share flow, and Miniapp
                    readiness notes.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <StatCard
                  label="Allocation"
                  value={`${allocation}%`}
                  helpText="Target exactly 100% for a balanced share card."
                />
                <StatCard
                  label="Left to assign"
                  value={`${Math.max(0, 100 - allocation)}%`}
                  helpText="A helpful guardrail for solo mobile editing."
                />
                <StatCard
                  label="Wallet"
                  value="Optional"
                  helpText="Connect later for ownership, saving, or attribution."
                />
              </div>

              <div
                className={`mt-5 rounded-3xl p-4 text-sm ${
                  allocation === 100
                    ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                    : "border border-amber-400/20 bg-amber-500/10 text-amber-100"
                }`}
              >
                {validationMessage}
              </div>

              {statusMessage ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  {statusMessage}
                </div>
              ) : null}

              <div className="mt-6">
                <ShareActions
                  onShare={sharePortfolio}
                  onCopy={copyShareText}
                  isMiniApp={isMiniApp}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Market Headlines"
              title="Keep the dashboard alive with stock news"
              description="MVP uses a mock-first news feed so the app remains resilient if upstream market APIs are unavailable or rate-limited."
            />
            <NewsFeed items={news} loading={newsLoading} error={newsError} />
          </div>

          <div className="space-y-6">
            <SectionHeading
              eyebrow="Shipping Notes"
              title="Official integration checklist"
              description="The current implementation keeps sensitive configuration out of the client and leaves wallet/Farcaster SDK wiring optional until production credentials are available."
            />

            <div className="grid gap-4">
              {[
                "Add real Farcaster Miniapp SDK lifecycle hooks inside a dedicated provider when the production manifest URL is finalized.",
                "Configure Base wallet connection with public chain config only; never expose provider secrets.",
                "Swap mock stock and news services for server-side Route Handlers backed by Finnhub or Yahoo-compatible fetchers.",
                "Use the /api/miniapp/manifest route as the stable source for Miniapp registration and future Base App metadata expansion.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}