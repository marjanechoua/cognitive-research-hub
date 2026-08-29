import { getPapers } from "@/lib/papers";
import { getConcepts } from "@/lib/concepts";
import {Paper} from "@/types/paper";
import {Concept} from "@/types/concept";

const PAPERS_STORAGE_KEY = "cognitive-research-papers";
const CONCEPTS_STORAGE_KEY = "cognitive-research-concepts";

export function connectPaperToConcept(
    paperId: string,
    conceptId: string
): void {
    const papers = getPapers();
    const concepts = getConcepts();

    const paper = papers.find(
        (paper) => paper.id === paperId
    );

    const concept = concepts.find(
        (concept) => concept.id === conceptId
    );

    if (!paper || !concept) return;

    // Paper → Concept
    if (!paper.conceptIds.includes(conceptId)) {
        paper.conceptIds.push(conceptId);
    }

    // Concept → Paper
    if (!concept.paperIds.includes(paperId)) {
        concept.paperIds.push(paperId);
    }

    concept.updatedAt = new Date().toISOString();

    localStorage.setItem(
        PAPERS_STORAGE_KEY,
        JSON.stringify(papers)
    );

    localStorage.setItem(
        CONCEPTS_STORAGE_KEY,
        JSON.stringify(concepts)
    );
}

export function disconnectPaperFromConcept(
    paperId: string,
    conceptId: string
): void {
    const papers = getPapers();
    const concepts = getConcepts();

    const paper = papers.find(
        (paper) => paper.id === paperId
    );

    const concept = concepts.find(
        (concept) => concept.id === conceptId
    );

    if (!paper || !concept) return;

    // Paper → Concept
    paper.conceptIds = paper.conceptIds.filter(
        (id) => id !== conceptId
    );

    // Concept → Paper
    concept.paperIds = concept.paperIds.filter(
        (id) => id !== paperId
    );

    concept.updatedAt = new Date().toISOString();

    localStorage.setItem(
        PAPERS_STORAGE_KEY,
        JSON.stringify(papers)
    );

    localStorage.setItem(
        CONCEPTS_STORAGE_KEY,
        JSON.stringify(concepts)
    );
}


export function getPapersForConcept(
    conceptId: string
): Paper[] {
    const papers = getPapers();

    return papers.filter(
        (paper) =>
            paper.conceptIds.includes(conceptId)
    );
}
export function getConceptsForPaper(
    paperId: string
): Concept[] {
    const concepts = getConcepts();

    return concepts.filter(
        (concept) =>
            concept.paperIds.includes(paperId)
    );
}