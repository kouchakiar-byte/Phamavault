import type { LucideIcon } from "lucide-react";
import { AlertTriangle, BookOpen, CheckCircle2, Droplets, FlaskConical, HelpCircle, Pill, Scale, Syringe } from "lucide-react";
import { compoundingGuide as g } from "@/content/pharmacy";
import type { Locale } from "@/i18n/config";

const icons: Record<string, LucideIcon> = {
  when: HelpCircle,
  technique: FlaskConical,
  oral: Syringe,
  capsules: Pill,
  topical: Droplets,
  suppositories: BookOpen,
  weighing: Scale,
  hazardous: AlertTriangle,
};

function RefLine({ refs }: { refs: string[] }) {
  return (
    <p className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3 text-[0.7rem] text-muted transition group-hover:border-capsule-400/40">
      {refs.map((r) => (
        <bdi key={r} dir="ltr" className="rounded-md bg-paper px-1.5 py-0.5">
          {r}
        </bdi>
      ))}
    </p>
  );
}

/** Key numbers and the step-by-step technique cards. */
export function CompoundingBasics({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-bold text-vault-900">{g.factsTitle[locale]}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {g.facts.map((f) => (
            <div key={f.value} className="rounded-2xl bg-vault-900 p-5 text-white">
              <p className="flex items-baseline gap-1.5">
                <span className="pv-gold-text text-4xl font-bold leading-none" dir="ltr">
                  {f.value}
                </span>
                <span className="text-sm font-semibold text-capsule-400">{f.unit[locale]}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-vault-100/85">{f.text[locale]}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-vault-900">{g.topicsTitle[locale]}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {g.topics.map((topic, i) => {
            const Icon = icons[topic.key] ?? FlaskConical;
            return (
              <article
                key={topic.key}
                className="group flex flex-col rounded-card border border-vault-100 bg-vault-50 p-6 transition duration-300 ease-out hover:scale-[0.98] hover:border-capsule-400 hover:bg-gradient-to-br hover:from-capsule-50 hover:to-white hover:shadow-lg hover:shadow-capsule-500/15 motion-reduce:transform-none"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-vault-900 text-molecule-400 transition group-hover:bg-capsule-500 group-hover:text-vault-950">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h4 className="font-bold text-vault-900">
                    <span className="me-1.5 font-mono text-xs text-muted">{(i + 1).toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}.</span>
                    {topic.title[locale]}
                  </h4>
                </div>
                <ul className="mt-4 flex-1 space-y-2.5">
                  {topic.points.map((p) => (
                    <li key={p.en} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-molecule-600 group-hover:text-capsule-600" aria-hidden="true" />
                      {p[locale]}
                    </li>
                  ))}
                </ul>
                <RefLine refs={topic.refs} />
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Published formulas, paediatric excipients and the labelling checklist. */
export function CompoundingTables({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-vault-900">{g.formulasTitle[locale]}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{g.formulasLead[locale]}</p>
        <div className="mt-4 overflow-x-auto rounded-card border border-line bg-white">
          <table className="db min-w-[720px]">
            <thead>
              <tr>
                <th>{g.formulaCols.drug[locale]}</th>
                <th>{g.formulaCols.vehicle[locale]}</th>
                <th>{g.formulaCols.stability[locale]}</th>
                <th>{g.formulaCols.ref[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {g.formulas.map((f) => (
                <tr key={f.drug.en}>
                  <td className="font-semibold text-vault-900">{f.drug[locale]}</td>
                  <td>{f.vehicle[locale]}</td>
                  <td>
                    <span className="rounded-full bg-capsule-50 px-2.5 py-1 text-xs font-semibold text-capsule-700">{f.stability[locale]}</span>
                  </td>
                  <td className="text-xs text-muted">
                    <bdi dir="ltr">{f.ref}</bdi>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-vault-900">{g.excipientsTitle[locale]}</h3>
        <div className="mt-4 overflow-x-auto rounded-card border border-line bg-white">
          <table className="db min-w-[680px]">
            <thead>
              <tr>
                <th>{g.excipientCols.name[locale]}</th>
                <th>{g.excipientCols.risk[locale]}</th>
                <th>{g.excipientCols.advice[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {g.excipients.map((x) => (
                <tr key={x.name.en}>
                  <td className="font-semibold text-vault-900">{x.name[locale]}</td>
                  <td>{x.risk[locale]}</td>
                  <td>{x.advice[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <RefLine refs={g.excipientRefs} />
      </div>

      <div className="rounded-card border border-capsule-400/40 bg-gradient-to-br from-capsule-50 to-white p-6">
        <h3 className="text-lg font-bold text-vault-900">{g.counselTitle[locale]}</h3>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {g.counsel.map((c) => (
            <li key={c.en} className="flex gap-2.5 text-sm leading-relaxed text-ink">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-capsule-600" aria-hidden="true" />
              {c[locale]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
