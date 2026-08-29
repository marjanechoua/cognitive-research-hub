
import { getPapers } from "@/lib/papers";
import { getConcepts } from "@/lib/concepts";

import { Paper } from "@/types/paper";
import { Concept } from "@/types/concept";

const PAPERS_STORAGE_KEY =
    "cognitive-research-papers";

const CONCEPTS_STORAGE_KEY =
    "cognitive-research-concepts";

/**
 * Connect a paper with a concept.
 *
 * Updates both sides:
 *
 * Paper → Concept
 * Concept → Paper
 */
export function connectPaperToConcept(
    paperId: string,
    conceptId: string
): void {
    if (typeof window === "undefined") {
        return;
    }

    const papers = getPapers();
    const concepts = getConcepts();

    const paper = papers.find(
        (paper) => paper.id === paperId
    );

    const concept = concepts.find(
        (concept) => concept.id === conceptId
    );

    if (!paper || !concept) {
        return;
    }

    /*
     * Make sure arrays exist.
     */
    paper.conceptIds =
        paper.conceptIds ?? [];

    concept.paperIds =
        concept.paperIds ?? [];

    /*
     * Paper → Concept
     */
    if (
        !paper.conceptIds.includes(
            conceptId
        )
    ) {
        paper.conceptIds.push(
            conceptId
        );
    }

    /*
     * Concept → Paper
     */
    if (
        !concept.paperIds.includes(
            paperId
        )
    ) {
        concept.paperIds.push(
            paperId
        );
    }

    const now =
        new Date().toISOString();

    concept.updatedAt = now;

    /*
     * Save both collections.
     */
    localStorage.setItem(
        PAPERS_STORAGE_KEY,
        JSON.stringify(papers)
    );

    localStorage.setItem(
        CONCEPTS_STORAGE_KEY,
        JSON.stringify(concepts)
    );
}

/**
 * Disconnect a paper from a concept.
 *
 * Removes the relationship from both sides.
 */
export function disconnectPaperFromConcept(
    paperId: string,
    conceptId: string
): void {
    if (typeof window === "undefined") {
        return;
    }

    const papers = getPapers();
    const concepts = getConcepts();

    const paper = papers.find(
        (paper) => paper.id === paperId
    );

    const concept = concepts.find(
        (concept) => concept.id === conceptId
    );

    if (!paper || !concept) {
        return;
    }

    /*
     * Make sure arrays exist.
     */
    paper.conceptIds =
        paper.conceptIds ?? [];

    concept.paperIds =
        concept.paperIds ?? [];

    /*
     * Paper → Concept
     */
    paper.conceptIds =
        paper.conceptIds.filter(
            (id) => id !== conceptId
        );

    /*
     * Concept → Paper
     */
    concept.paperIds =
        concept.paperIds.filter(
            (id) => id !== paperId
        );

    const now =
        new Date().toISOString();

    concept.updatedAt = now;

    /*
     * Save both collections.
     */
    localStorage.setItem(
        PAPERS_STORAGE_KEY,
        JSON.stringify(papers)
    );

    localStorage.setItem(
        CONCEPTS_STORAGE_KEY,
        JSON.stringify(concepts)
    );
}

/**
 * Get all papers connected to a concept.
 */
export function getPapersForConcept(
    conceptId: string
): Paper[] {
    const papers = getPapers();

    return papers.filter(
        (paper) =>
            (
                paper.conceptIds ?? []
            ).includes(conceptId)
    );
}

/**
 * Get all concepts connected to a paper.
 */
export function getConceptsForPaper(
    paperId: string
): Concept[] {
    const concepts = getConcepts();

    return concepts.filter(
        (concept) =>
            (
                concept.paperIds ?? []
            ).includes(paperId)
    );
}

