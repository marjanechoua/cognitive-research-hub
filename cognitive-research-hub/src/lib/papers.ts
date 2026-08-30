import { supabase } from "@/lib/supabase/client";
import { Paper } from "@/types/paper";

type PaperRow = {
    id: string;
    title: string;
    authors: string[];
    year: number | null;
    doi: string | null;
    url: string | null;
    status: Paper["status"];
    topics: string[];
    research_question: string | null;
    method: string | null;
    results: string | null;
    interpretation: string | null;
    critique: string | null;
    what_i_learned: string | null;
    created_at: string;
    user_id: string;
};

function mapPaper(row: PaperRow): Paper {
    return {
        id: row.id,
        title: row.title,
        authors: Array.isArray(row.authors)
            ? row.authors
            : [],
        year: row.year ?? 0,
        doi: row.doi ?? "",
        url: row.url ?? "",
        status: row.status,
        topics: Array.isArray(row.topics)
            ? row.topics
            : [],
        conceptIds: [],
        researchQuestion: row.research_question ?? "",
        method: row.method ?? "",
        results: row.results ?? "",
        interpretation: row.interpretation ?? "",
        critique: row.critique ?? "",
        whatILearned: row.what_i_learned ?? "",
        createdAt: row.created_at,
    };
}

export async function getPapers(): Promise<Paper[]> {
    const { data, error } = await supabase
        .from("papers")
        .select("*")
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        console.error(
            "Failed to load papers:",
            error
        );

        return [];
    }

    return (data as PaperRow[]).map(mapPaper);
}

export async function getPaper(
    id: string
): Promise<Paper | undefined> {
    const { data, error } = await supabase
        .from("papers")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error(
            "Failed to load paper:",
            error
        );

        return undefined;
    }

    if (!data) {
        return undefined;
    }

    return mapPaper(data as PaperRow);
}

export async function savePaper(
    paper: Paper
): Promise<void> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error(
            "You must be logged in to save a paper."
        );
    }

    const { error } = await supabase
        .from("papers")
        .upsert({
            id: paper.id,
            user_id: user.id,
            title: paper.title,
            authors: paper.authors,
            year: paper.year || null,
            doi: paper.doi || null,
            url: paper.url || null,
            status: paper.status,
            topics: paper.topics,
            research_question:
            paper.researchQuestion,
            method: paper.method,
            results: paper.results,
            interpretation:
            paper.interpretation,
            critique: paper.critique,
            what_i_learned:
            paper.whatILearned,
            created_at: paper.createdAt,
        });

    if (error) {
        console.error(
            "Failed to save paper:",
            error
        );

        throw error;
    }
}

export async function deletePaper(
    id: string
): Promise<void> {
    const { error } = await supabase
        .from("papers")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(
            "Failed to delete paper:",
            error
        );

        throw error;
    }
}