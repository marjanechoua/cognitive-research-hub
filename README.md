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

The project also serves as an intersection between my two interests: **computer science and neuroscience**. Building the application allows me to develop my software engineering skills while simultaneously developing better habits for reading, analyzing, and thinking about scientific literature.

The knowledge graph and research analytics are therefore not just visual features. They are designed to help me understand how individual papers and concepts fit together as my understanding of a research area develops.

Ultimately, this project is both a software project and a personal learning tool — a way to use my background in computer science to explore whether I want to pursue research in neuroscience.


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
The core research management workflow is functional, including paper and concept management, relationships, visualization, analytics, persistent data storage with Supabase, and scientific paper search.
Paper–concept relationships are stored and synchronized through Supabase, allowing research data to persist across sessions and devices.
The application has now moved beyond browser-only local persistence and uses Supabase as its backend/database layer. 
The next development steps will focus on improving the research workflow, expanding the knowledge graph, and adding further research features.
