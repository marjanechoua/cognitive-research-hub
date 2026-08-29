export type PaperStatus =
    | "to-read"
    | "reading"
    | "read"
    | "analyzed";

export type Paper = {
    id: string;

    title: string;
    authors: string[];
    year: number;

    doi: string;
    url: string;

    status: PaperStatus;

    topics: string[];

    conceptIds: string[];

    researchQuestion: string;
    method: string;
    results: string;
    interpretation: string;
    critique: string;
    whatILearned: string;

    createdAt: string;
};