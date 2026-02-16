type OpenAICostAmount = {
    value: string;
    currency: string;
};

type OpenAICostResult = {
    object: "organization.costs.result";
    amount: OpenAICostAmount;
    project_id: string | null;
    line_item: string | null;
};

type OpenAICostBucket = {
    object: "bucket";
    start_time: number;
    end_time: number;
    results?: OpenAICostResult[];
    result?: OpenAICostResult[];
};

type OpenAICostsResponse = {
    object: "page";
    data: OpenAICostBucket[];
    has_more: boolean;
    next_page: string | null;
};

export type OpenAICostReport = {
    totalCost: number;
    startTime: number;
    endTime: number;
};

function lastNDaysDateRange(now = new Date(), days = 30) {
    const endTime = Math.floor(now.getTime() / 1000);
    const startTime = endTime - days * 24 * 60 * 60;
    return { startTime, endTime };
}

function parseAmountValue(value: unknown): number {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
        const n = Number.parseFloat(value);
        return Number.isFinite(n) ? n : 0;
    }
    return 0;
}

async function fetchOpenAI(url: URL): Promise<Response> {
    const adminKey = process.env["OPENAI_ADMIN_KEY"];
    if (!adminKey) throw new Error("Missing OPENAI_ADMIN_KEY");

    const org = process.env["OPENAI_ORG_ID"];
    if (!org) throw new Error("Missing OPENAI_ORG_ID");

    const headers: Record<string, string> = {
        "Authorization": `Bearer ${adminKey}`,
        "Content-Type": "application/json",
        "OpenAI-Organization": org
    };

    return await fetch(url, { headers });
}

export default async function get_openai_costs(): Promise<OpenAICostReport> {
    const { startTime, endTime } = lastNDaysDateRange();

    let total = 0;
    let currency: string | null = null;

    let page: string | null = null;
    while (true) {
        const url = new URL("https://api.openai.com/v1/organization/costs");
        url.searchParams.set("start_time", String(startTime));
        url.searchParams.set("end_time", String(endTime));
        url.searchParams.set("bucket_width", "1d");
        url.searchParams.set("limit", "180");
        if (page) url.searchParams.set("page", page);

        const resp = await fetchOpenAI(url);
        const bodyText = await resp.text();

        let body: unknown = null;
        try {
            body = bodyText ? JSON.parse(bodyText) : null;
        } catch {
            body = bodyText;
        }

        if (!resp.ok) {
            throw new Error(
                `OpenAI request failed (${resp.status}): ${typeof body === "string" ? body : JSON.stringify(body)}`
            );
        }

        const parsed = body as OpenAICostsResponse;
        for (const bucket of parsed.data ?? []) {
            const results = bucket.results ?? bucket.result ?? [];
            for (const r of results) {
                total += parseAmountValue(r?.amount?.value);
                if (!currency && typeof r?.amount?.currency === "string") currency = r.amount.currency;
            }
        }

        if (!parsed.has_more || !parsed.next_page) break;
        page = parsed.next_page;
    }

    return {
        totalCost: Math.round(total * 100.0) / 100.0,
        startTime,
        endTime,
    };
}
