
import {
    Concept,
    ConceptRelationType,
} from "@/types/concept";
const STORAGE_KEY = "cognitive-research-concepts";

export function getConcepts(): Concept[] {
    if (typeof window === "undefined") {
        return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        return [];
    }

    return JSON.parse(stored);
}

export function getConcept(
    id: string
): Concept | undefined {
    const concepts = getConcepts();

    return concepts.find(
        (concept) => concept.id === id
    );
}

export function saveConcept(
    concept: Concept
): void {
    const concepts = getConcepts();

    const existingIndex = concepts.findIndex(
        (existingConcept) =>
            existingConcept.id === concept.id
    );

    if (existingIndex >= 0) {
        concepts[existingIndex] = concept;
    } else {
        concepts.push(concept);
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(concepts)
    );
}

export function deleteConcept(
    id: string
): void {
    const concepts = getConcepts();

    const filteredConcepts = concepts.filter(
        (concept) => concept.id !== id
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(filteredConcepts)
    );
}



export function addConceptRelation(
    conceptId: string,
    relatedConceptId: string,
    type: ConceptRelationType
): void {
    const concepts = getConcepts();

    const concept = concepts.find(
        (concept) => concept.id === conceptId
    );

    if (!concept) return;

    const alreadyExists = concept.relations.some(
        (relation) =>
            relation.conceptId === relatedConceptId
    );

    if (!alreadyExists) {
        concept.relations.push({
            conceptId: relatedConceptId,
            type,
        });
    }

    concept.updatedAt = new Date().toISOString();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(concepts)
    );
}

export function removeConceptRelation(
    conceptId: string,
    relatedConceptId: string
): void {
    const concepts = getConcepts();

    const concept = concepts.find(
        (concept) => concept.id === conceptId
    );

    if (!concept) return;

    concept.relations = concept.relations.filter(
        (relation) =>
            relation.conceptId !== relatedConceptId
    );

    concept.updatedAt = new Date().toISOString();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(concepts)
    );
}


export function connectConcepts(
    conceptId: string,
    relatedConceptId: string,
    type: ConceptRelationType
): void {
    const concepts = getConcepts();

    const concept = concepts.find(
        (concept) => concept.id === conceptId
    );

    const relatedConcept = concepts.find(
        (concept) => concept.id === relatedConceptId
    );

    if (!concept || !relatedConcept) return;

    if (conceptId === relatedConceptId) return;

    const reverseTypeMap: Record<
        ConceptRelationType,
        ConceptRelationType
    > = {
        related: "related",
        contrasts: "contrasts",
        "part-of": "contains",
        contains: "part-of",
        causes: "caused-by",
        "caused-by": "causes",
        supports: "supported-by",
        "supported-by": "supports",
    };

    const reverseType = reverseTypeMap[type];

    /*
     * Update or create relation from concept -> relatedConcept
     */
    const existingRelation = concept.relations.find(
        (relation) =>
            relation.conceptId === relatedConceptId
    );

    if (existingRelation) {
        existingRelation.type = type;
    } else {
        concept.relations.push({
            conceptId: relatedConceptId,
            type,
        });
    }

    /*
     * Update or create reverse relation
     * relatedConcept -> concept
     */
    const existingReverseRelation =
        relatedConcept.relations.find(
            (relation) =>
                relation.conceptId === conceptId
        );

    if (existingReverseRelation) {
        existingReverseRelation.type = reverseType;
    } else {
        relatedConcept.relations.push({
            conceptId,
            type: reverseType,
        });
    }

    const now = new Date().toISOString();

    concept.updatedAt = now;
    relatedConcept.updatedAt = now;

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(concepts)
    );
}


export function disconnectConcepts(
    conceptId: string,
    relatedConceptId: string
): void {
    const concepts = getConcepts();

    const concept = concepts.find(
        (concept) => concept.id === conceptId
    );

    const relatedConcept = concepts.find(
        (concept) => concept.id === relatedConceptId
    );

    if (!concept || !relatedConcept) return;

    concept.relations = concept.relations.filter(
        (relation) =>
            relation.conceptId !== relatedConceptId
    );

    relatedConcept.relations =
        relatedConcept.relations.filter(
            (relation) =>
                relation.conceptId !== conceptId
        );

    concept.updatedAt = new Date().toISOString();
    relatedConcept.updatedAt =
        new Date().toISOString();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(concepts)
    );
}

