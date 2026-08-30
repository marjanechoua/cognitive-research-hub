export type ConceptRelationType =
    | "related"
    | "contrasts"
    | "part-of"
    | "contains"
    | "causes"
    | "caused-by"
    | "supports"
    | "supported-by";

export type ConceptRelation = {
    conceptId: string;
    type: ConceptRelationType;
};

export type Concept = {
    id: string;

    name: string;
    definition: string;

    field: string;

    aliases: string[];

    relations: ConceptRelation[];

    paperIds: string[];

    notes: string;
    understanding: string;
    openQuestions: string;

    createdAt: string;
    updatedAt: string;
};