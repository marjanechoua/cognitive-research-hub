
import { Paper } from "@/types/paper";

const STORAGE_KEY = "cognitive-research-papers";
const CONCEPTS_STORAGE_KEY =
    "cognitive-research-concepts";

/**
 * Load all papers from localStorage.
 */
export function getPapers(): Paper[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const stored =
            localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map((paper) => ({
            ...paper,
            authors: Array.isArray(paper.authors)
                ? paper.authors
                : [],
            topics: Array.isArray(paper.topics)
                ? paper.topics
                : [],
            conceptIds: Array.isArray(
                paper.conceptIds
            )
                ? paper.conceptIds
                : [],
            doi: paper.doi ?? "",
            url: paper.url ?? "",
            researchQuestion:
                paper.researchQuestion ?? "",
            method: paper.method ?? "",
            results: paper.results ?? "",
            interpretation:
                paper.interpretation ?? "",
            critique: paper.critique ?? "",
            whatILearned:
                paper.whatILearned ?? "",
        }));
    } catch (error) {
        console.error(
            "Failed to load papers:",
            error
        );

        return [];
    }
}

/**
 * Get a single paper by ID.
 */
export function getPaper(
    id: string
): Paper | undefined {
    const papers = getPapers();

    return papers.find(
        (paper) => paper.id === id
    );
}

/**
 * Create or update a paper.
 */
export function savePaper(
    paper: Paper
): void {
    if (typeof window === "undefined") {
        return;
    }

    const papers = getPapers();

    const existingIndex =
        papers.findIndex(
            (existingPaper) =>
                existingPaper.id === paper.id
        );

    const normalizedPaper: Paper = {
        ...paper,
        authors: Array.isArray(paper.authors)
            ? paper.authors
            : [],
        topics: Array.isArray(paper.topics)
            ? paper.topics
            : [],
        conceptIds: Array.isArray(
            paper.conceptIds
        )
            ? paper.conceptIds
            : [],
        doi: paper.doi ?? "",
        url: paper.url ?? "",
    };

    if (existingIndex >= 0) {
        papers[existingIndex] =
            normalizedPaper;
    } else {
        papers.push(normalizedPaper);
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(papers)
    );
}

/**
 * Delete a paper.
 *
 * Also removes the paper from every connected concept.
 */
export function deletePaper(
    id: string
): void {
    if (typeof window === "undefined") {
        return;
    }

    const papers = getPapers();

    const filteredPapers =
        papers.filter(
            (paper) => paper.id !== id
        );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(filteredPapers)
    );

    /*
     * Remove paper references from concepts.
     */
    const conceptsRaw =
        localStorage.getItem(
            CONCEPTS_STORAGE_KEY
        );

    if (!conceptsRaw) {
        return;
    }

    try {
        const concepts =
            JSON.parse(conceptsRaw);

        if (!Array.isArray(concepts)) {
            return;
        }

        const now =
            new Date().toISOString();

        const updatedConcepts =
            concepts.map((concept) => {
                const paperIds =
                    Array.isArray(
                        concept.paperIds
                    )
                        ? concept.paperIds
                        : [];

                const hadPaper =
                    paperIds.includes(id);

                return {
                    ...concept,
                    paperIds:
                        paperIds.filter(
                            (paperId: string) =>
                                paperId !== id
                        ),
                    updatedAt: hadPaper
                        ? now
                        : concept.updatedAt,
                };
            });

        localStorage.setItem(
            CONCEPTS_STORAGE_KEY,
            JSON.stringify(
                updatedConcepts
            )
        );
    } catch (error) {
        console.error(
            "Failed to update concepts after deleting paper:",
            error
        );
    }
}

