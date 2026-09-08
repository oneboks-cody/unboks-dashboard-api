import { Link } from "wouter";
import type { IslunoToday } from "@/lib/isluno-operations";
export function IslunoRecovery({
  data,
}: {
  data: NonNullable<IslunoToday["recovery"]>;
}) {
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5"
      aria-label="Recovery and cutover audit"
    >
      <h2 className="mb-3 text-lg font-semibold">
        Recovery & legacy transition
      </h2>
      <p className="mb-3 text-sm">
        Reminders:{" "}
        {data.reminders_enabled ? "enabled by configured policy" : "disabled"}.
        Accepted sends are not replayed. Ambiguous or interrupted sends require
        operator reconciliation.
      </p>
      {data.incidents.map((item) => (
        <article key={item.id} className="mb-3 rounded-xl border p-4">
          <strong>{item.kind.replaceAll("_", " ")}</strong>
          <p>
            {item.status} · {item.code}
          </p>
          <p className="my-2 text-sm">
            Saved progress is retained. No automatic model retry or send is
            claimed.
          </p>
          {item.itinerary_id && (
            <Link
              className="inline-flex min-h-11 items-center font-semibold text-teal-800"
              href={
                "/itineraries/" +
                encodeURIComponent(item.scope_key + "." + item.itinerary_id)
              }
            >
              Review saved itinerary
            </Link>
          )}
        </article>
      ))}
      {data.outbound_failures.map((item) => (
        <p key={item.id} className="mb-2 break-all text-sm">
          Discovery reply {item.id} · {item.status} · Provider reference:{" "}
          {item.provider_id ?? "unknown"}
        </p>
      ))}
      {data.reminders.map((item) => (
        <p key={item.id} className="mb-2 break-all text-sm">
          Reminder {item.id} · {item.status}
          {item.reason ? " · " + item.reason : ""} · Due {item.due_at}
          {item.provider_id ? " · Provider reference: " + item.provider_id : ""}
        </p>
      ))}
      {data.legacy.quarantined.length > 0 && (
        <>
          <h3 className="mt-4 font-semibold">Quarantined Mermaid work</h3>
          <p className="my-2 text-sm">
            Legacy history is retained. Rollback keeps these actions stopped;
            operator review is required before any manual follow-up.
          </p>
          <Link
            className="inline-flex min-h-11 items-center font-semibold text-teal-800"
            href="/reservations?view=mermaid"
          >
            Open original Mermaid records
          </Link>
          {data.legacy.quarantined.map((item) => (
            <p
              key={item.source + item.reference}
              className="mt-2 break-all text-sm"
            >
              {item.source} · {item.reference} · Original:{" "}
              {item.original_status} · {item.disposition.replaceAll("_", " ")}
            </p>
          ))}
        </>
      )}
      {data.incidents.length === 0 &&
        data.outbound_failures.length === 0 &&
        data.reminders.length === 0 &&
        data.legacy.quarantined.length === 0 && (
          <p>No recovery incidents or quarantined work recorded.</p>
        )}
    </section>
  );
}
