
import {
    Concept,
    ConceptRelationType,
} from "@/types/concept";

const STORAGE_KEY = "cognitive-research-concepts";

/**
 * Load all concepts from localStorage.
 */
export function getConcepts(): Concept[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map((concept) => ({
            ...concept,
            aliases: concept.aliases ?? [],
            relations: concept.relations ?? [],
            paperIds: concept.paperIds ?? [],
            notes: concept.notes ?? "",
            definition: concept.definition ?? "",
            field: concept.field ?? "",
            createdAt:
                concept.createdAt ??
                new Date().toISOString(),
            updatedAt:
                concept.updatedAt ??
                new Date().toISOString(),
        }));
    } catch (error) {
        console.error(
            "Failed to load concepts:",
            error
        );

        return [];
    }
}

/**
 * Get a single concept by ID.
 */
export function getConcept(
    id: string
): Concept | undefined {
    const concepts = getConcepts();

    return concepts.find(
        (concept) => concept.id === id
    );
}

/**
 * Create or update a concept.
 */
export function saveConcept(
    concept: Concept
): void {
    if (typeof window === "undefined") {
        return;
    }

    const concepts = getConcepts();

    const existingIndex = concepts.findIndex(
        (existingConcept) =>
            existingConcept.id === concept.id
    );

    const normalizedConcept: Concept = {
        ...concept,
        aliases: concept.aliases ?? [],
        relations: concept.relations ?? [],
        paperIds: concept.paperIds ?? [],
        notes: concept.notes ?? "",
        definition: concept.definition ?? "",
        field: concept.field ?? "",
        updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
        concepts[existingIndex] = normalizedConcept;
    } else {
        concepts.push(normalizedConcept);
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(concepts)
    );
}

/**
 * Delete a concept.
 */
export function deleteConcept(
    id: string
): void {
    if (typeof window === "undefined") {
        return;
    }

    const concepts = getConcepts();

    const filteredConcepts = concepts.filter(
        (concept) => concept.id !== id
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(filteredConcepts)
    );
}

/**
 * Add a one-way relation.
 */
export function addConceptRelation(
    conceptId: string,
    relatedConceptId: string,
    type: ConceptRelationType
): void {
    if (typeof window === "undefined") {
        return;
    }

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

    concept.updatedAt =
        new Date().toISOString();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(concepts)
    );
}

/**
 * Remove a one-way relation.
 */
export function removeConceptRelation(
    conceptId: string,
    relatedConceptId: string
): void {
    if (typeof window === "undefined") {
        return;
    }

    const concepts = getConcepts();

    const concept = concepts.find(
        (concept) => concept.id === conceptId
    );

    if (!concept) return;

    concept.relations = concept.relations.filter(
        (relation) =>
            relation.conceptId !== relatedConceptId
    );

    concept.updatedAt =
        new Date().toISOString();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(concepts)
    );
}

/**
 * Connect two concepts in both directions.
 */
export function connectConcepts(
    conceptId: string,
    relatedConceptId: string,
    type: ConceptRelationType
): void {
    if (typeof window === "undefined") {
        return;
    }

    const concepts = getConcepts();

    const concept = concepts.find(
        (concept) => concept.id === conceptId
    );

    const relatedConcept = concepts.find(
        (concept) => concept.id === relatedConceptId
    );

    if (!concept || !relatedConcept) {
        return;
    }

    if (conceptId === relatedConceptId) {
        return;
    }

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

    const existingRelation =
        concept.relations.find(
            (relation) =>
                relation.conceptId ===
                relatedConceptId
        );

    if (existingRelation) {
        existingRelation.type = type;
    } else {
        concept.relations.push({
            conceptId: relatedConceptId,
            type,
        });
    }

    const existingReverseRelation =
        relatedConcept.relations.find(
            (relation) =>
                relation.conceptId === conceptId
        );

    if (existingReverseRelation) {
        existingReverseRelation.type =
            reverseType;
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

/**
 * Disconnect two concepts in both directions.
 */
export function disconnectConcepts(
    conceptId: string,
    relatedConceptId: string
): void {
    if (typeof window === "undefined") {
        return;
    }

    const concepts = getConcepts();

    const concept = concepts.find(
        (concept) => concept.id === conceptId
    );

    const relatedConcept = concepts.find(
        (concept) => concept.id === relatedConceptId
    );

    if (!concept || !relatedConcept) {
        return;
    }

    concept.relations =
        concept.relations.filter(
            (relation) =>
                relation.conceptId !==
                relatedConceptId
        );

    relatedConcept.relations =
        relatedConcept.relations.filter(
            (relation) =>
                relation.conceptId !== conceptId
        );

    const now = new Date().toISOString();

    concept.updatedAt = now;
    relatedConcept.updatedAt = now;

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(concepts)
    );
}

