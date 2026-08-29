
export type OpenAlexPaper = {
    id: string;
    title: string;
    authors: string[];
    year: number | null;
    doi: string | null;
    url: string | null;
};

type OpenAlexResponse = {
    results?: Array<{
        id?: string;
        display_name?: string;
        publication_year?: number | null;
        doi?: string | null;

        primary_location?: {
            landing_page_url?: string | null;
        } | null;

        authorships?: Array<{
            author?: {
                display_name?: string | null;
            } | null;
        }>;
    }>;
};

export async function searchOpenAlex(
    query: string
): Promise<OpenAlexPaper[]> {
    if (!query.trim()) {
        return [];
    }

    const response = await fetch(
        `https://api.openalex.org/works?search=${encodeURIComponent(
    query
)}&per-page=10`
    );

    if (!response.ok) {
        throw new Error("OpenAlex search failed");
    }

    const data =
        (await response.json()) as OpenAlexResponse;

    return (data.results ?? []).map((paper) => ({
        id: paper.id ?? crypto.randomUUID(),

        title:
            paper.display_name ??
            "Untitled paper",

        authors:
            (paper.authorships ?? [])
                .map(
                    (authorship) =>
                        authorship.author?.display_name
                )
                .filter(
                    (author): author is string =>
                        Boolean(author)
                ),

        year:
            paper.publication_year ?? null,

        doi:
            paper.doi ?? null,

        url:
            paper.primary_location
                ?.landing_page_url ?? null,
    }));
}

