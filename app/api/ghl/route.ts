import { NextResponse } from "next/server";

const GHL_API_KEY = "pit-7b605592-a9bc-4f2c-a491-47694fd88bb3";
const GHL_LOCATION_ID = "b80CbQkQdj8vg0uue9Ea";
const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

const HEADERS = {
  "Authorization": `Bearer ${GHL_API_KEY}`,
  "Version": GHL_VERSION,
};

const PIPELINE_NAMES: Record<string, string> = {
  "v7mNIEAZfIi3ddoF9oh7": "🔥 Seller Leads (Hot)",
  "Ar9I3e1u5EbwcjiyIUQS": "🏆 Dispo to Close",
  "xGV27E7HqkPWpiLQ1KPg": "📈 Follow Ups",
  "81XkO1LDYpM0ivC85Ey0": "🥶 Cold Calling",
};

const STAGE_NAMES: Record<string, string> = {
  "b594dfa1-b16c-4724-9e37-04ce7c11d010": "🚀 New Lead",
  "45f8f30e-5889-4ac1-8d95-8455673a1d4b": "💬 Attempting Manual",
  "d662bcb0-e116-41b7-bff4-762d56f89701": "📞 Attempting Auto",
  "1585c467-f96e-4f3c-a6f7-79d0553a73e6": "👀 Due Diligence",
  "fe20f28b-214c-4406-9eac-acc34edb825b": "📆 Appt Booked",
  "781f4930-7b5c-414e-84e2-05b11c4bf4c5": "❓ Post Appt F/U",
  "628c18ae-da6d-4f91-b237-bfccb35ddc20": "💰 Made Offer",
  "189ef81b-6c02-4469-9599-25b2b8e22f01": "✍️ Sign Contract",
  "8bf3bda0-d073-4783-9ce5-d6b8b99d8e10": "✅ Signed - Dispo",
  "bb7928c9-b461-4e2e-931c-19f31a383d65": "🚫 Canceled",
  "5f598f55-131a-4caa-bff5-72dd425f29d0": "👎 Pass",
  "17c74bb5-1c71-4406-8cd6-e155f0f5ccb7": "🔎 Finding Buyer",
  "ee0b0ee3-bbc8-4e8e-aaf8-9d4a1af1bd15": "🙋 Potential Buyer",
  "de830707-ea87-4322-aaf0-0783e63b96fa": "✍️ Sign Buyer Contract",
  "d8dcd718-4cb2-42f5-90e1-96db8a7224a3": "✅ In Escrow",
  "3feadb72-5a09-42c7-ad32-8fa6a14ff25d": "🏆 Closed",
  "c7bfcdcb-39e5-4b47-b74c-d00d9d977238": "💩 Deal Fell Apart",
  "b36309b8-fe42-4782-8dbb-db74e8f97b78": "✅ Due Today",
  "93201df5-b4cd-4d83-bc64-3b638a2ddd79": "📆 Next F/U",
  "591644b6-6bf5-437c-bf8f-9dbbb7ce3f6c": "💤 7 Day F/U",
  "ff14a73d-e0e7-4734-9539-dfdf75222d6f": "💤 14 Day F/U",
  "5e1e4bf3-e565-4ef1-beb5-be47848a4a93": "💤 30 Day F/U",
  "98a2e981-4102-4fb0-9804-257c8a7cb538": "💸 Price Too High",
  "5ed2d144-6682-4c5b-80af-7c52c227ded3": "⏳ Timing Not Right",
  "934a4aa8-fc14-49f5-9653-a6c564815dd0": "🥶 Cold Reactivation",
  "ea4f8eec-aed2-406e-8948-c9049935c7d0": "🛑 Stopped Responding",
  "be379e32-94d8-4eb9-bb3b-9d12af034258": "☠️ Dead Lost",
  "e9b1f125-8f15-4c1f-a262-04f3b3afda25": "1️⃣ Needs 1st Call",
  "55bb1ef1-7599-4855-8b07-97e683b481e6": "2️⃣ Needs 2nd Call",
  "dd60a9e9-f081-4fb8-9824-4512d1eef838": "3️⃣ Needs 3rd Call",
  "f88a215e-7bea-4c7f-b71e-29520d81f25a": "😴 Call Attempts Exhausted",
  "9c2c4b7d-e28b-4e96-be14-f9a8c1730ea0": "📞 Call Back Requested",
  "90d18882-903a-4cc5-9e45-20aebdea5c8d": "✅ Qualified Lead",
  "76d5c6bc-7504-41df-9248-42ac2971c2b2": "☠️ Wrong Numbers",
  "65250f4a-b95b-483d-b987-07cb48953025": "🛑 DNC",
  "e32d51e9-427c-4e02-8e78-93cc58cd470f": "👎 Not Interested",
  "53d8a85a-e99d-4b5e-8aa6-fd915dee3854": "😩 Already Sold",
};

// Stale thresholds per stage (days)
const STALE_THRESHOLDS: Record<string, number> = {
  "b594dfa1-b16c-4724-9e37-04ce7c11d010": 1,  // New Lead
  "45f8f30e-5889-4ac1-8d95-8455673a1d4b": 2,  // Attempting Manual
  "d662bcb0-e116-41b7-bff4-762d56f89701": 2,  // Attempting Auto
  "fe20f28b-214c-4406-9eac-acc34edb825b": 1,  // Appt Booked
  "628c18ae-da6d-4f91-b237-bfccb35ddc20": 2,  // Made Offer
  "189ef81b-6c02-4469-9599-25b2b8e22f01": 1,  // Sign Contract
  "d8dcd718-4cb2-42f5-90e1-96db8a7224a3": 3,  // In Escrow
};
const DEFAULT_STALE = 3;

async function fetchAllOpportunities(): Promise<any[]> {
  const all: any[] = [];
  let url: string | null =
    `${GHL_BASE}/opportunities/search?location_id=${GHL_LOCATION_ID}&limit=100`;

  while (url) {
    const response: Response = await fetch(url, { headers: HEADERS });
    if (!response.ok) throw new Error(`GHL API error: ${response.status}`);
    const data: any = await response.json();
    all.push(...(data.opportunities || []));
    url = data.meta?.nextPageUrl || null;
  }
  return all;
}

async function fetchContacts() {
  const res = await fetch(
    `${GHL_BASE}/contacts/?locationId=${GHL_LOCATION_ID}&limit=1`,
    { headers: HEADERS }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data.meta?.total || 0;
}

export async function GET() {
  try {
    const [opps, totalContacts] = await Promise.all([
      fetchAllOpportunities(),
      fetchContacts(),
    ]);

    const now = Date.now();

    // Build pipeline summary
    const pipelineCounts: Record<string, number> = {};
    const stageCounts: Record<string, Record<string, number>> = {};
    const staleDeals: any[] = [];
    let totalOpen = 0;
    let totalWon = 0;

    for (const o of opps) {
      const pid = o.pipelineId || "unknown";
      const stageId = o.pipelineStageId || "";
      const status = o.status || "";
      const name = o.name || "Unknown";
      const updated = o.dateUpdated || o.dateAdded || "";
      const contactName = o.contact?.name || "";
      const contactPhone = o.contact?.phone || "";

      pipelineCounts[pid] = (pipelineCounts[pid] || 0) + 1;

      if (!stageCounts[pid]) stageCounts[pid] = {};
      stageCounts[pid][stageId] = (stageCounts[pid][stageId] || 0) + 1;

      if (status === "open") totalOpen++;
      if (status === "won") totalWon++;

      // Stale detection
      if (status === "open" && updated) {
        const updatedMs = new Date(updated).getTime();
        const days = Math.floor((now - updatedMs) / 86400000);
        const threshold = STALE_THRESHOLDS[stageId] ?? DEFAULT_STALE;

        if (days >= threshold) {
          staleDeals.push({
            id: o.id,
            name,
            contactName,
            contactPhone,
            pipeline: PIPELINE_NAMES[pid] || pid,
            stage: STAGE_NAMES[stageId] || stageId,
            days,
            severity: days >= threshold * 2 ? "critical" : "high",
            pipelineId: pid,
            stageId,
          });
        }
      }
    }

    // Sort stale by days desc
    staleDeals.sort((a, b) => b.days - a.days);

    // Build per-pipeline stage breakdown
    const pipelines = Object.entries(pipelineCounts).map(([pid, total]) => ({
      id: pid,
      name: PIPELINE_NAMES[pid] || pid,
      total,
      stages: Object.entries(stageCounts[pid] || {}).map(([sid, count]) => ({
        id: sid,
        name: STAGE_NAMES[sid] || sid,
        count,
      })).sort((a, b) => b.count - a.count),
    }));

    return NextResponse.json({
      success: true,
      lastRefresh: new Date().toISOString(),
      summary: {
        totalOpportunities: opps.length,
        totalOpen,
        totalWon,
        totalContacts,
        staleCount: staleDeals.length,
        criticalStale: staleDeals.filter(s => s.severity === "critical").length,
      },
      pipelines,
      staleDeals: staleDeals.slice(0, 20),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
