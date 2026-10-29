"use client";

import { useMemo, useState } from "react";
import { abelLimits, confidenceInterval, sampleSize } from "@/lib/be-stats";

type Labels = Record<
  "ciTitle" | "ciLead" | "nTitle" | "nLead" | "gmr" | "cv" | "n" | "power" | "dropout" | "ci" | "pass" | "fail" | "result" | "enrol" | "achieved" | "invalid" | "abel" | "abelLead" | "cvwr" | "limits" | "disclaimer",
  string
>;

const pct = (x: number) => (x * 100).toFixed(2);

function Field({ label, value, onChange, min, max, step }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  return (
    <label className="block text-sm">
      <span className="font-semibold text-vault-900">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        dir="ltr"
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="field-input mt-1 w-full text-start"
      />
    </label>
  );
}

function Result({ label, children, tone = "neutral" }: { label: string; children: React.ReactNode; tone?: "neutral" | "ok" | "bad" }) {
  const color = tone === "ok" ? "bg-molecule-50 text-molecule-700 ring-molecule-400/50" : tone === "bad" ? "bg-red-50 text-red-700 ring-red-300" : "bg-vault-50 text-vault-900 ring-line";
  return (
    <div className={`rounded-xl px-4 py-3 ring-1 ${color}`}>
      <p className="text-xs font-semibold opacity-80">{label}</p>
      <p className="mt-1 font-mono text-lg font-bold" dir="ltr" style={{ textAlign: "start" }}>
        {children}
      </p>
    </div>
  );
}

/** 90% CI, sample size and EMA widened limits for a 2×2 crossover bioequivalence study. */
export function BeCalculator({ labels: t }: { labels: Labels }) {
  const [gmr, setGmr] = useState(95);
  const [cv, setCv] = useState(20);
  const [n, setN] = useState(24);
  const [sGmr, setSGmr] = useState(95);
  const [sCv, setSCv] = useState(25);
  const [power, setPower] = useState(80);
  const [dropout, setDropout] = useState(10);
  const [cvwr, setCvwr] = useState(40);

  const ci = useMemo(() => {
    if (!(gmr > 0 && cv > 0 && n >= 4)) return null;
    return confidenceInterval(gmr / 100, cv / 100, Math.round(n));
  }, [gmr, cv, n]);
  const ciOk = ci ? Number(pct(ci[0])) >= 80 && Number(pct(ci[1])) <= 125 : false;

  const size = useMemo(() => {
    if (!(sGmr > 80 && sGmr < 125 && sCv > 0 && power > 50 && power < 100)) return null;
    return sampleSize(sGmr / 100, sCv / 100, power / 100);
  }, [sGmr, sCv, power]);
  const enrol = size ? Math.ceil(size.n / (1 - Math.min(Math.max(dropout, 0), 50) / 100) / 2) * 2 : null;

  const abel = cvwr > 0 ? abelLimits(cvwr / 100) : null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-card border border-line bg-white p-5">
          <h3 className="font-bold text-vault-900">{t.ciTitle}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{t.ciLead}</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Field label={t.gmr} value={gmr} onChange={setGmr} min={50} max={200} step={0.1} />
            <Field label={t.cv} value={cv} onChange={setCv} min={1} max={100} step={0.5} />
            <Field label={t.n} value={n} onChange={setN} min={4} max={500} step={2} />
          </div>
          {ci && (
            <div className="mt-4 space-y-2">
              <Result label={t.ci} tone={ciOk ? "ok" : "bad"}>
                {pct(ci[0])}% – {pct(ci[1])}%
              </Result>
              <p className={`text-sm font-semibold ${ciOk ? "text-molecule-700" : "text-red-700"}`}>{ciOk ? t.pass : t.fail}</p>
            </div>
          )}
        </section>

        <section className="rounded-card border border-line bg-white p-5">
          <h3 className="font-bold text-vault-900">{t.nTitle}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{t.nLead}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label={t.gmr} value={sGmr} onChange={setSGmr} min={81} max={124} step={0.5} />
            <Field label={t.cv} value={sCv} onChange={setSCv} min={1} max={100} step={0.5} />
            <Field label={t.power} value={power} onChange={setPower} min={60} max={99} step={1} />
            <Field label={t.dropout} value={dropout} onChange={setDropout} min={0} max={50} step={1} />
          </div>
          <div className="mt-4 space-y-2">
            {size ? (
              <>
                <Result label={t.result} tone="ok">
                  n = {size.n}
                </Result>
                <div className="grid grid-cols-2 gap-2">
                  <Result label={t.enrol}>{enrol}</Result>
                  <Result label={t.achieved}>{pct(size.power)}%</Result>
                </div>
              </>
            ) : (
              <p className="text-sm text-red-700">{t.invalid}</p>
            )}
          </div>
        </section>

        <section className="rounded-card border border-line bg-white p-5">
          <h3 className="font-bold text-vault-900">{t.abel}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{t.abelLead}</p>
          <div className="mt-4">
            <Field label={t.cvwr} value={cvwr} onChange={setCvwr} min={1} max={100} step={0.5} />
          </div>
          {abel && (
            <div className="mt-4">
              <Result label={t.limits} tone="ok">
                {pct(abel[0])}% – {pct(abel[1])}%
              </Result>
            </div>
          )}
        </section>
      </div>
      <p className="text-xs leading-relaxed text-muted">{t.disclaimer}</p>
    </div>
  );
}
