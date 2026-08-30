
import { supabase } from "@/lib/supabase/client";

import { getPapers } from "@/lib/papers";
import { getConcepts } from "@/lib/concepts";

import { Paper } from "@/types/paper";
import { Concept } from "@/types/concept";

/**
 * Connect a paper with a concept.
 *
 * The relationship is stored in the
 * paper_concepts table.
 */
export async function connectPaperToConcept(
    paperId: string,
    conceptId: string
): Promise<void> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error(
            "You must be logged in to connect papers and concepts."
        );
    }

    /*
     * Check that the paper belongs to the user.
     */
    const { data: paper, error: paperError } =
        await supabase
            .from("papers")
            .select("id")
            .eq("id", paperId)
            .eq("user_id", user.id)
            .single();

    if (paperError || !paper) {
        console.error(
            "Paper not found:",
            paperError
        );
        return;
    }

    /*
     * Check that the concept belongs to the user.
     */
    const {
        data: concept,
        error: conceptError,
    } = await supabase
        .from("concepts")
        .select("id")
        .eq("id", conceptId)
        .eq("user_id", user.id)
        .single();

    if (conceptError || !concept) {
        console.error(
            "Concept not found:",
            conceptError
        );
        return;
    }

    /*
     * Create the relationship.
     */
    const { error } = await supabase
        .from("paper_concepts")
        .upsert({
            paper_id: paperId,
            concept_id: conceptId,
        });

    if (error) {
        console.error(
            "Failed to connect paper and concept:",
            error
        );

        throw error;
    }
}

/**
 * Disconnect a paper from a concept.
 */
export async function disconnectPaperFromConcept(
    paperId: string,
    conceptId: string
): Promise<void> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error(
            "You must be logged in to disconnect papers and concepts."
        );
    }

    /*
     * Make sure the paper belongs to the user.
     */
    const { data: paper } = await supabase
        .from("papers")
        .select("id")
        .eq("id", paperId)
        .eq("user_id", user.id)
        .single();

    if (!paper) {
        return;
    }

    /*
     * Delete the relationship.
     *
     * RLS on paper_concepts makes sure that
     * only the user's own relationships can
     * be deleted.
     */
    const { error } = await supabase
        .from("paper_concepts")
        .delete()
        .eq("paper_id", paperId)
        .eq("concept_id", conceptId);

    if (error) {
        console.error(
            "Failed to disconnect paper and concept:",
            error
        );

        throw error;
    }
}

/**
 * Get all papers connected to a concept.
 */
export async function getPapersForConcept(
    conceptId: string
): Promise<Paper[]> {
    const { data, error } = await supabase
        .from("paper_concepts")
        .select("paper_id")
        .eq("concept_id", conceptId);

    if (error) {
        console.error(
            "Failed to load papers for concept:",
            error
        );

        return [];
    }

    const paperIds =
        data?.map(
            (relation) => relation.paper_id
        ) ?? [];

    if (paperIds.length === 0) {
        return [];
    }

    const papers = await getPapers();

    return papers.filter((paper) =>
        paperIds.includes(paper.id)
    );
}

/**
 * Get all concepts connected to a paper.
 */
export async function getConceptsForPaper(
    paperId: string
): Promise<Concept[]> {
    const { data, error } = await supabase
        .from("paper_concepts")
        .select("concept_id")
        .eq("paper_id", paperId);

    if (error) {
        console.error(
            "Failed to load concepts for paper:",
            error
        );

        return [];
    }

    const conceptIds =
        data?.map(
            (relation) => relation.concept_id
        ) ?? [];

    if (conceptIds.length === 0) {
        return [];
    }

    const concepts = await getConcepts();

    return concepts.filter((concept) =>
        conceptIds.includes(concept.id)
    );
}

