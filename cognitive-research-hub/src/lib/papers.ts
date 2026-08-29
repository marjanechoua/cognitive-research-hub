import { Paper } from "@/types/paper";

const STORAGE_KEY = "cognitive-research-papers";

export function getPapers(): Paper[] {
    if (typeof window === "undefined") {
        return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        return [];
    }

    return JSON.parse(stored);
}

export function getPaper(id: string): Paper | undefined {
    const papers = getPapers();

    return papers.find((paper) => paper.id === id);
}

export function savePaper(paper: Paper): void {
    const papers = getPapers();

    const existingIndex = papers.findIndex(
        (existingPaper) => existingPaper.id === paper.id
    );

    if (existingIndex >= 0) {
        papers[existingIndex] = paper;
    } else {
        papers.push(paper);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
}

export function deletePaper(id: string): void {
    const papers = getPapers();

    const filteredPapers = papers.filter(
        (paper) => paper.id !== id
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(filteredPapers)
    );

    // Remove paper references from concepts
    const conceptsRaw = localStorage.getItem(
        "cognitive-research-concepts"
    );

    if (!conceptsRaw) return;

    const concepts = JSON.parse(conceptsRaw);

    const updatedConcepts = concepts.map(
        (concept: {
            paperIds: string[];
            updatedAt: string;
        }) => ({
            ...concept,
            paperIds: concept.paperIds.filter(
                (paperId: string) => paperId !== id
            ),
            updatedAt:
                concept.paperIds.includes(id)
                    ? new Date().toISOString()
                    : concept.updatedAt,
        })
    );

    localStorage.setItem(
        "cognitive-research-concepts",
        JSON.stringify(updatedConcepts)
    );
}

