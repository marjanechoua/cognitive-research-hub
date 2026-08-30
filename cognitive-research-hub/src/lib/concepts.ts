
import {
    Concept,
    ConceptRelationType,
} from "@/types/concept";

import { supabase } from "@/lib/supabase/client";

/**
 * Load all concepts belonging to the current user.
 */
export async function getConcepts(): Promise<Concept[]> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const { data: concepts, error } = await supabase
        .from("concepts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
            ascending: true,
        });

    if (error) {
        console.error(
            "Failed to load concepts:",
            error
        );

        return [];
    }

    if (!concepts) {
        return [];
    }

    const conceptIds = concepts.map(
        (concept) => concept.id
    );

    let relations: any[] = [];

    if (conceptIds.length > 0) {
        const {
            data: relationData,
            error: relationError,
        } = await supabase
            .from("concept_relations")
            .select("*")
            .in("concept_id", conceptIds);

        if (relationError) {
            console.error(
                "Failed to load concept relations:",
                relationError
            );
        } else {
            relations = relationData ?? [];
        }
    }

    return concepts.map((concept) => ({
        id: concept.id,

        name: concept.name ?? "",
        definition: concept.definition ?? "",
        field: concept.field ?? "",

        aliases: Array.isArray(concept.aliases)
            ? concept.aliases
            : [],

        relations: relations
            .filter(
                (relation) =>
                    relation.concept_id ===
                    concept.id
            )
            .map((relation) => ({
                conceptId:
                    relation.related_concept_id,
                type:
                    relation.relation_type as ConceptRelationType,
            })),

        // Paper connections are handled separately.
        paperIds: [],

        notes: concept.notes ?? "",

        createdAt:
            concept.created_at ??
            new Date().toISOString(),

        updatedAt:
            concept.updated_at ??
            new Date().toISOString(),
    }));
}

/**
 * Get a single concept by ID.
 */
export async function getConcept(
    id: string
): Promise<Concept | undefined> {
    const concepts = await getConcepts();

    return concepts.find(
        (concept) => concept.id === id
    );
}

/**
 * Create or update a concept.
 */
export async function saveConcept(
    concept: Concept
): Promise<void> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error(
            "You must be logged in to save a concept."
        );
    }

    const now = new Date().toISOString();

    const { error } = await supabase
        .from("concepts")
        .upsert({
            id: concept.id,
            user_id: user.id,

            name: concept.name,
            definition: concept.definition,
            field: concept.field,

            aliases: concept.aliases ?? [],

            notes: concept.notes ?? "",

            created_at:
                concept.createdAt ?? now,

            updated_at: now,
        });

    if (error) {
        console.error(
            "Failed to save concept:",
            error
        );

        throw error;
    }
}

/**
 * Delete a concept.
 *
 * Relations belonging to the concept are removed
 * by the database foreign-key relationship if
 * configured with cascade delete.
 */
export async function deleteConcept(
    id: string
): Promise<void> {
    const { error } = await supabase
        .from("concepts")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(
            "Failed to delete concept:",
            error
        );

        throw error;
    }
}

/**
 * Add a one-way relation.
 */
export async function addConceptRelation(
    conceptId: string,
    relatedConceptId: string,
    type: ConceptRelationType
): Promise<void> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error(
            "You must be logged in to modify relations."
        );
    }

    const { error } = await supabase
        .from("concept_relations")
        .upsert({
            concept_id: conceptId,
            related_concept_id:
                relatedConceptId,
            relation_type: type,
        });

    if (error) {
        console.error(
            "Failed to add concept relation:",
            error
        );

        throw error;
    }
}

/**
 * Remove a one-way relation.
 */
export async function removeConceptRelation(
    conceptId: string,
    relatedConceptId: string
): Promise<void> {
    const { error } = await supabase
        .from("concept_relations")
        .delete()
        .eq("concept_id", conceptId)
        .eq(
            "related_concept_id",
            relatedConceptId
        );

    if (error) {
        console.error(
            "Failed to remove concept relation:",
            error
        );

        throw error;
    }
}

/**
 * Connect two concepts in both directions.
 */
export async function connectConcepts(
    conceptId: string,
    relatedConceptId: string,
    type: ConceptRelationType
): Promise<void> {
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

    const reverseType =
        reverseTypeMap[type];

    const { error: firstError } =
        await supabase
            .from("concept_relations")
            .upsert({
                concept_id: conceptId,
                related_concept_id:
                    relatedConceptId,
                relation_type: type,
            });

    if (firstError) {
        console.error(
            "Failed to create concept relation:",
            firstError
        );

        throw firstError;
    }

    const { error: reverseError } =
        await supabase
            .from("concept_relations")
            .upsert({
                concept_id: relatedConceptId,
                related_concept_id: conceptId,
                relation_type: reverseType,
            });

    if (reverseError) {
        console.error(
            "Failed to create reverse concept relation:",
            reverseError
        );

        throw reverseError;
    }
}

/**
 * Disconnect two concepts in both directions.
 */
export async function disconnectConcepts(
    conceptId: string,
    relatedConceptId: string
): Promise<void> {
    const { error: firstError } =
        await supabase
            .from("concept_relations")
            .delete()
            .eq("concept_id", conceptId)
            .eq(
                "related_concept_id",
                relatedConceptId
            );

    if (firstError) {
        console.error(
            "Failed to remove concept relation:",
            firstError
        );

        throw firstError;
    }

    const { error: reverseError } =
        await supabase
            .from("concept_relations")
            .delete()
            .eq(
                "concept_id",
                relatedConceptId
            )
            .eq(
                "related_concept_id",
                conceptId
            );

    if (reverseError) {
        console.error(
            "Failed to remove reverse concept relation:",
            reverseError
        );

        throw reverseError;
    }
}

