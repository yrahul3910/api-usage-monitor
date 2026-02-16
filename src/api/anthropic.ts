type AnthropicResponseResult = {
    currency: string,
    amount: string
};

type AnthropicResponseData = {
    starting_at: string,
    ending_at: string,
    results: AnthropicResponseResult[]
};

type AnthropicResponse = {
    has_more: boolean,
    next_page: string | null,
    data: AnthropicResponseData[]
}

export default async function get_anthropic_report(): Promise<string> {
    const BASE_URL = "https://api.anthropic.com/v1/organizations/cost_report";

    const now = new Date();
    const endingAt = new Date(now.getTime() + 1000);
    const startingAt = new Date(endingAt.getTime() - 30 * 24 * 60 * 60 * 1000);

    const OPTIONS = [
        ["starting_at", startingAt.toISOString()],
        ["ending_at", endingAt.toISOString()],
    ];
    const QUERY_PARAMS = OPTIONS.map(([k, v], _) => `${k}=${v}`).join("&");
    const URL = BASE_URL + "?" + QUERY_PARAMS;

    let total = 0.0;
    let curPageId: string | null = null;

    while (true) {
        let curPage = await fetch(
            URL + (curPageId ? `&page=${curPageId}` : ""),
            {
                headers: {
                    "anthropic-version": "2023-06-01",
                    "x-api-key": process.env["ANTHROPIC_ADMIN_KEY"]
                } as Record<string, string>
            });

        let body = await curPage.json() as AnthropicResponse;

        if (!curPage.ok) {
            throw new Error(`Anthropic request failed: ${JSON.stringify(body, null, 2)}`);
        }

        // Sum up all results from all date ranges
        for (const dateRange of body.data) {
            total += dateRange.results
                .map(res => Number.parseFloat(res.amount))
                .reduce((acc, cur) => acc + cur, 0);
        }

        if (!body.has_more) {
            break;
        }

        curPageId = body.next_page;
    }

    return "$" + (total / 100.0).toFixed(2);
}
