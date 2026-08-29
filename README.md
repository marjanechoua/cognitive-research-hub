# Cognitive Research Hub

A personal research workspace for organizing scientific papers, building a connected knowledge base, and reflecting on research.

The **Cognitive Research Hub** combines paper management, concept mapping, research analysis, and a visual knowledge graph in one application.

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
* Description
* Aliases
* Related papers
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

This provides a visual overview of the structure of the research library.

### Research Analytics

The dashboard provides analytics about the research collection, including:

* Number of papers
* Number of concepts
* Concept relationships
* Paper connections
* Recent papers
* Recent concepts

### Dark Mode

The interface supports a dark visual theme with a research-focused, minimal UI.

### Local Persistence

Research data is currently stored in the browser using `localStorage`.

This means:

* Data survives page reloads
* Papers and concepts remain available between sessions
* Relationships are persisted
* No backend database is currently required

> **Note:** Because the current version uses browser `localStorage`, data is tied to the browser/device being used. Clearing browser storage or using private browsing can remove the stored data.

---

## Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **OpenAlex API**
* **Browser localStorage**

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

### 3. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Project Structure

```text
app/
├── concepts/
│   ├── [id]/
│   ├── new/
│   └── page.tsx
│
├── notes/
│   └── page.tsx
│
├── papers/
│   ├── [id]/
│   │   ├── edit/
│   │   └── page.tsx
│   ├── new/
│   └── page.tsx
│
├── projects/
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── dashboard/
│   ├── ResearchAnalytics.tsx
│
├── knowledge-graph/
│   └── knowledgeGraph.tsx
│
├── navbar.tsx
├── theme-provider.tsx
└── theme-toggle.tsx

lib/
├── concepts.ts
├── openalex.ts
├── papers.ts
└── relationships.ts

types/
├── concept.ts
└── paper.ts
```

---

## Architecture

The application currently follows a simple client-side architecture.

### Data layer

Research data is handled through utility modules in `lib/`:

* `papers.ts` — paper storage and management
* `concepts.ts` — concept storage and management
* `relationships.ts` — paper/concept and concept/concept relationships
* `openalex.ts` — scientific paper search

### Data model

Papers and concepts are connected through IDs.

```text
Paper
 ├── conceptIds[]
 └── research analysis

Concept
 ├── paperIds[]
 └── relations[]
```

This allows the same research information to be viewed from different perspectives.

---

## Future Development

Possible future improvements include:

* Persistent cloud database
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

---

## Current Status

The project is currently in active development.

The core research management workflow is functional, including paper and concept management, relationships, visualization, analytics, local persistence, and scientific paper search.

The next major architectural step will be moving from browser-only storage toward a persistent backend/database.


