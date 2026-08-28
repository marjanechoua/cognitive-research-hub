type PaperPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function PaperPage({ params }: PaperPageProps) {
    const { id } = await params;

    return (
        <main>
            <h1>Paper</h1>
            <p>Paper ID: {id}</p>
        </main>
    );
}