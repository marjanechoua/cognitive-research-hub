# Cognitive Research Hub

A personal research workspace for organizing scientific papers, building a connected knowledge base, and reflecting on research.

The **Cognitive Research Hub** combines paper management, concept mapping, research analysis, and a visual knowledge graph in one application.

The project is primarily a personal learning and research tool: I use computer science and software development as a way to explore my interest in neuroscience and scientific research.

---

## Features

### Paper Library

* Create, edit, and delete research papers
* Track paper status:

  * To Read
  * Reading
  * Read
  * Analyzed
* Store authors, publication year, DOI, URL, and topics
* Add personal research notes and reflections
* View detailed paper pages

### Paper Search

Search for scientific papers directly from the application using the **OpenAlex API**.

Search results can automatically populate:

* Title
* Authors
* Publication year
* DOI
* Paper URL

This makes adding new papers much faster and reduces manual data entry.

### Concepts

Create and manage concepts that are important to your research.

Each concept can contain:

* Name
* Field
* Definition
* Aliases
* Related papers
* Personal notes
* Relationships to other concepts

### Knowledge Connections

Papers and concepts can be connected to build a structured research knowledge base.

Concepts can also have different relationship types, including:

* Related
* Contrasts
* Part of
* Contains
* Causes
* Caused by
* Supports
* Supported by

Relationships are maintained in both directions automatically.

### Knowledge Graph

The dashboard includes a visual knowledge graph showing how concepts and research papers are connected.

This provides a visual overview of the structure of the research library and helps reveal connections between ideas across different papers.

### Research Analytics

The dashboard provides analytics about the research collection, including:

* Number of papers
* Number of concepts
* Concept relationships
* Paper-concept connections
* Recent papers
* Recent concepts

### Dark Mode

The interface uses a dark, minimal visual theme designed around a research-focused workspace.

### Persistent Cloud Storage

Research data is stored using **Supabase** as the backend/database layer.

This means:

* Data persists across sessions
* Papers and concepts are stored in a persistent database
* Paper-concept relationships are stored separately
* Concept relationships are persisted
* Research data is no longer limited to a single browser or device
* The application can be extended toward authentication and multi-device synchronization

---

## Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Supabase**
* **OpenAlex API**

### Data & Backend

Supabase is used as the persistent backend and database layer.

The application uses relational data structures to represent:

* Papers
* Concepts
* Paper-concept relationships
* Concept-concept relationships

This allows research information to be connected rather than stored as isolated documents.

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd cognitive-research-hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

Create a Supabase project and configure the required environment variables.

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Make sure the required database tables are configured in your Supabase project.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Motivation

This project started as a personal tool for exploring scientific research alongside my computer science studies.

I am currently studying Computer Science and am interested in pursuing a master's degree in Neuroscience. Since I wanted to explore the field more seriously before making that decision, I wanted a way to actively work with scientific papers rather than simply reading and collecting them.

The goal was to create a research environment where I could:

* read and organize scientific papers
* summarize research questions, methods, and results
* record my own interpretations and critiques
* reflect on what I learned
* identify and connect important concepts across papers
* visualize relationships within my growing body of knowledge

Rather than building a generic paper management application, I wanted to create something that supports the way I personally want to learn from research.

The project sits at the intersection of my two main interests: **computer science and neuroscience**. I use software development as a tool for exploring scientific research and for building systems that support the way I learn.

AI-assisted development also played an important role in the project. Rather than treating the application purely as a demonstration of how much code I can write from scratch, I approached it as an opportunity to use modern development tools to turn an idea into a functioning research environment.

This project therefore represents more than a technical exercise. It demonstrates how I use my computer science background to investigate questions and interests outside traditional software development.

The knowledge graph and research analytics are not just visual features. They are designed to help me understand how individual papers and concepts fit together as my understanding of a research area develops.

Ultimately, this project is both a software project and a personal learning tool — a way to use computer science as a tool for exploring whether I want to pursue research in neuroscience.

---

## Architecture

The application follows a client-side architecture with Supabase providing persistent backend storage.

### Data Layer

Research data is accessed through utility modules in `lib/`:

* `papers.ts` — paper retrieval and management
* `concepts.ts` — concept retrieval and management
* `relationships.ts` — paper/concept and concept/concept relationships
* `openalex.ts` — scientific paper search
* `supabase/` — Supabase client configuration

The UI communicates with these modules rather than directly managing database operations throughout the application.

### Data Model

Papers and concepts are connected through relational tables and IDs.

```text
Paper
 ├── metadata
 ├── research analysis
 └── paper_concepts
          │
          ▼
       Concept
        ├── metadata
        ├── notes
        └── concept relationships
```

Paper-concept relationships are stored in Supabase rather than embedded only inside the paper or concept records.

This allows the same research information to be viewed from different perspectives:

```text
Paper → Concepts
Concept → Papers
Concept → Related Concepts
```

The structure is designed to support the knowledge graph and future expansion of the research system.

---

## Development Approach

This project is intentionally being developed as an evolving research tool rather than as a fixed application.

The implementation has gone through several iterations, including an initial browser-based persistence approach and a later migration to Supabase.

AI-assisted development is part of this process. I use AI tools to help with implementation, debugging, architecture decisions, refactoring, and exploring possible solutions.

The important goal is not to present the project as code written entirely manually, but to demonstrate how I can use software development tools to turn a research-oriented idea into a working system and continuously improve it.

---

## Future Development

Possible future improvements include:

* User accounts and authentication
* PDF storage and full-text reading
* Open-access PDF detection
* Automatic topic extraction
* AI-assisted paper summarization
* AI-assisted research analysis
* Advanced search and filtering
* Citation management
* Import from additional academic APIs
* Export to BibTeX / RIS
* Research projects and collections
* Cross-device synchronization
* More advanced knowledge graph visualization
* Citation and reference relationships
* Research timelines and reading progress

---

## Current Status

The project is currently in active development.

The core research management workflow is functional, including:

* Paper management
* Concept management
* Paper-concept relationships
* Concept relationships
* Knowledge graph visualization
* Research analytics
* Persistent data storage with Supabase
* Scientific paper search through OpenAlex
* Research notes and analysis

The application has moved beyond browser-only persistence and now uses **Supabase as its backend and database layer**. Paper-concept relationships and concept relationships are persisted in the database, allowing the research knowledge base to survive across sessions and devices.

The next development steps will focus on improving the research workflow, expanding the knowledge graph, and adding further tools for reading, analyzing, and connecting scientific literature.
