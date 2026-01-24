type OpenRouterReportData = {
    total_credits: number,
    total_usage: number
}

type OpenRouterReport = {
    data: OpenRouterReportData
}

export default async function get_openrouter_report(): Promise<OpenRouterReportData> {
    const URL = "https://openrouter.ai/api/v1/credits";

    let curPage = await fetch(URL, {
        headers: {
            "Authorization": `Bearer ${process.env["OPENROUTER_PROVISIONING_KEY"]}`
        }
    });

    let body = await curPage.json() as OpenRouterReport;

    if (!curPage.ok) {
        throw new Error(`OpenRouter request failed: ${JSON.stringify(body)}`);
    }

    return {
        total_credits: Math.round(body.data.total_credits * 100.0) / 100.0,
        total_usage: Math.round(body.data.total_usage * 100.0) / 100.0
    }

}
