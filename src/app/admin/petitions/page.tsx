"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PetitionReview = {
  $id: string;
  slug: string;
  title: string;
  description: string;
  demand: string;
  targetAuthority: string;
  category: string;
  state: string;
  district: string;
};

export default function PetitionReviewsPage() {
  const [petitions, setPetitions] = useState<PetitionReview[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);

  async function load(offset = 0) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/petitions?offset=${offset}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load petition reviews.");
      if (!Array.isArray(data.petitions)) throw new Error("Invalid review response.");
      setPetitions((old) => offset ? [...old, ...data.petitions.filter((item: PetitionReview) => !old.some((p) => p.$id === item.$id))] : data.petitions);
      setHasMore(data.hasMore === true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load petition reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/admin/petitions?offset=0", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load petition reviews.");
        if (!Array.isArray(data.petitions)) throw new Error("Invalid review response.");
        return data;
      })
      .then((data) => { if (!controller.signal.aborted) { setPetitions(data.petitions); setHasMore(data.hasMore === true); } })
      .catch((cause) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not load petition reviews."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  async function review(petitionId: string, action: "approve" | "reject") {
    setBusyId(petitionId);
    setError("");
    try {
      const response = await fetch("/api/admin/petitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petitionId, action, reason: action === "reject" ? reason : "Approved after review." }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not confirm this review. Refresh the list.");
      setPetitions((old) => old.filter((item) => item.$id !== petitionId));
      setRejectId(null);
      setReason("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not confirm this review.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-5 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/admin" className="text-sm text-slate-600 underline dark:text-slate-300">Back to issue reviews</Link>
        <div>
          <h1 className="text-3xl font-semibold">Petition reviews</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Check each petition before citizens can sign it.</p>
        </div>
        {error && <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900">{error} <button className="ml-2 underline" onClick={() => void load()}>Refresh</button></div>}
        {loading && petitions.length === 0 && <p>Loading reviews...</p>}
        {!loading && !error && petitions.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">No petitions await review.</p>}
        {petitions.map((petition) => (
          <article key={petition.$id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{petition.category} · {petition.district || petition.state}</p>
            <h2 className="mt-2 text-xl font-semibold">{petition.title}</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{petition.description}</p>
            <p className="mt-4 text-sm"><strong>Demand:</strong> {petition.demand}</p>
            <p className="mt-2 text-sm"><strong>Target:</strong> {petition.targetAuthority}</p>
            <Link href={`/petitions/${encodeURIComponent(petition.slug)}`} className="mt-4 inline-block text-sm underline">Open full petition</Link>
            <div className="mt-6 flex flex-wrap gap-3">
              <button disabled={busyId !== null} onClick={() => void review(petition.$id, "approve")} className="min-h-11 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-950">Approve petition</button>
              <button disabled={busyId !== null} onClick={() => { setRejectId(petition.$id); setReason(""); }} className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-semibold disabled:opacity-50">Reject</button>
            </div>
            {rejectId === petition.$id && <div className="mt-4 space-y-3">
              <label htmlFor={`reason-${petition.$id}`} className="block text-sm font-medium">Reason for rejection</label>
              <textarea id={`reason-${petition.$id}`} value={reason} onChange={(event) => setReason(event.target.value)} maxLength={2000} className="min-h-24 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-950" />
              <button disabled={!reason.trim() || busyId !== null} onClick={() => void review(petition.$id, "reject")} className="min-h-11 rounded-full bg-rose-700 px-5 text-sm font-semibold text-white disabled:opacity-50">Confirm rejection</button>
            </div>}
          </article>
        ))}
        {hasMore && <button disabled={loading} onClick={() => void load(petitions.length)} className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-semibold disabled:opacity-50">Load more</button>}
      </div>
    </main>
  );
}
