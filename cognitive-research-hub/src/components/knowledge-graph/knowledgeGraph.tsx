"use client";

import Link from "next/link";
import { useState, MouseEvent, WheelEvent } from "react";

import { Concept } from "@/types/concept";

type KnowledgeGraphProps = {
  concepts: Concept[];
};

type NodePosition = {
  x: number;
  y: number;
};

export default function KnowledgeGraph({ concepts }: KnowledgeGraphProps) {
  const width = 900;
  const height = 420;

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  });

  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({
    x: 0,
    y: 0,
  });

  const positions: NodePosition[] = concepts.map((_, index) => {
    const centerX = width / 2;
    const centerY = height / 2;

    if (concepts.length === 1) {
      return {
        x: centerX,
        y: centerY,
      };
    }

    const angle = (index / concepts.length) * Math.PI * 2 - Math.PI / 2;

    const radius = Math.min(150, 80 + concepts.length * 12);

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });

  const getPosition = (id: string) => {
    const index = concepts.findIndex((concept) => concept.id === id);

    return positions[index];
  };

  const edges: {
    from: NodePosition;
    to: NodePosition;
    key: string;
    type: string;
  }[] = [];

  concepts.forEach((concept) => {
    concept.relations.forEach((relation) => {
      const target = concepts.find((other) => other.id === relation.conceptId);

      if (!target) return;

      const from = getPosition(concept.id);
      const to = getPosition(target.id);

      if (!from || !to) return;

      const key = [concept.id, target.id].sort().join("-");

      if (!edges.some((edge) => edge.key === key)) {
        edges.push({
          from,
          to,
          key,
          type: relation.type,
        });
      }
    });
  });

  function zoomIn() {
    setZoom((value) => Math.min(value + 0.2, 2.5));
  }

  function zoomOut() {
    setZoom((value) => Math.max(value - 0.2, 0.5));
  }

  function resetView() {
    setZoom(1);
    setOffset({
      x: 0,
      y: 0,
    });
  }

  function handleMouseDown(event: MouseEvent) {
    setDragging(true);

    setLastMouse({
      x: event.clientX,
      y: event.clientY,
    });
  }

  function handleMouseMove(event: MouseEvent) {
    if (!dragging) return;

    const dx = event.clientX - lastMouse.x;

    const dy = event.clientY - lastMouse.y;

    setOffset((current) => ({
      x: current.x + dx,
      y: current.y + dy,
    }));

    setLastMouse({
      x: event.clientX,
      y: event.clientY,
    });
  }

  function handleMouseUp() {
    setDragging(false);
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();

    const direction = event.deltaY > 0 ? -0.1 : 0.1;

    setZoom((value) => Math.min(Math.max(value + direction, 0.5), 2.5));
  }

  if (concepts.length === 0) {
    return (
      <div
        className="
                    flex min-h-105
                    items-center justify-center
                    rounded-2xl
                    border border-(--border)
                    bg-(--surface)
                    shadow-sm
                "
      >
        <div className="text-center">
          <div
            className="
                            mx-auto flex h-12 w-12
                            items-center justify-center
                            rounded-2xl
                            bg-(--accent-soft)
                            text-xl
                            text-(--accent)
                        "
          >
            +
          </div>

          <p className="mt-4 text-sm font-medium">
            Your knowledge graph is empty
          </p>

          <p className="mt-1 text-sm text-(--muted)">
            Create some concepts to start building your research network.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
                overflow-hidden
                rounded-2xl
                border border-(--border)
                bg-(--surface)
                shadow-sm
            "
    >
      <div
        className="relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: dragging ? "grabbing" : "grab",
        }}
      >
        {/* Grid */}
        <div
          className="
                        pointer-events-none
                        absolute inset-0
                        opacity-40
                    "
          style={{
            backgroundImage:
              "radial-gradient(circle at center, var(--accent-soft) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Controls */}
        <div
          className="
                        absolute right-4 top-4 z-10
                        flex flex-col
                        overflow-hidden
                        rounded-xl
                        border border-(--border)
                        bg-(--surface)
                        shadow-sm
                    "
        >
          <button
            type="button"
            onClick={zoomIn}
            className="
                            flex h-9 w-9
                            items-center justify-center
                            text-lg
                            text-(--foreground)
                            transition
                            hover:bg-(--surface-hover)
                            hover:text-(--accent)
                        "
          >
            +
          </button>

          <div className="h-px bg-(--border)" />

          <button
            type="button"
            onClick={zoomOut}
            className="
                            flex h-9 w-9
                            items-center justify-center
                            text-lg
                            text-(--foreground)
                            transition
                            hover:bg-(--surface-hover)
                            hover:text-(--accent)
                        "
          >
            −
          </button>

          <div className="h-px bg-(--border)" />

          <button
            type="button"
            onClick={resetView}
            className="
                            flex h-9 w-9
                            items-center justify-center
                            text-xs
                            font-medium
                            text-(--muted)
                            transition
                            hover:bg-(--surface-hover)
                            hover:text-(--accent)
                        "
            title="Reset view"
          >
            ↺
          </button>
        </div>

        {/* Zoom indicator */}
        <div
          className="
                        absolute bottom-4 left-4 z-10
                        rounded-lg
                        border border-(--border)
                        bg-(--surface)
                        px-2.5 py-1.5
                        text-xs
                        text-(--muted)
                        shadow-sm
                    "
        >
          {Math.round(zoom * 100)}%
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="relative h-105 w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform={`
translate(
    ${offset.x}
${offset.y}
)
translate(
    ${width / 2}
${height / 2}
)
scale(${zoom})
translate(
    ${-width / 2}
${-height / 2}
)
`}
          >
            {/* Connections */}
            <g>
              {edges.map((edge) => (
                <g key={edge.key}>
                  <line
                    x1={edge.from.x}
                    y1={edge.from.y}
                    x2={edge.to.x}
                    y2={edge.to.y}
                    stroke="var(--accent)"
                    strokeOpacity="0.3"
                    strokeWidth="2"
                  />

                  {/* Relationship label */}
                  <text
                    x={(edge.from.x + edge.to.x) / 2}
                    y={(edge.from.y + edge.to.y) / 2 - 6}
                    textAnchor="middle"
                    fill="var(--muted)"
                    fontSize="9"
                  >
                    {edge.type}
                  </text>
                </g>
              ))}
            </g>

            {/* Nodes */}
            <g>
              {concepts.map((concept, index) => {
                const position = positions[index];

                const relationshipCount = concept.relations.length;

                const radius = Math.min(28, 20 + relationshipCount * 3);

                return (
                  <Link key={concept.id} href={`/concepts/${concept.id}`}>
                    <g className="cursor-pointer">
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={radius + 9}
                        fill="var(--accent-soft)"
                        opacity="0.35"
                      />

                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={radius}
                        fill="var(--accent)"
                        stroke="var(--surface)"
                        strokeWidth="4"
                      />

                      <text
                        x={position.x}
                        y={position.y + 5}
                        textAnchor="middle"
                        fill="white"
                        fontSize="14"
                        fontWeight="600"
                      >
                        {concept.name.charAt(0).toUpperCase()}
                      </text>

                      <text
                        x={position.x}
                        y={position.y + radius + 22}
                        textAnchor="middle"
                        fill="var(--foreground)"
                        fontSize="13"
                        fontWeight="500"
                      >
                        {concept.name.length > 22
                          ? `${concept.name.slice(0, 22)}…`
                          : concept.name}
                      </text>
                    </g>
                  </Link>
                );
              })}
            </g>
          </g>
        </svg>
      </div>

      {/* Footer */}
      <div
        className="
                    flex flex-col gap-3
                    border-t border-(--border)
                    px-5 py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
      >
        <div className="flex items-center gap-5">
          <div>
            <p className="text-xs text-(--muted)">Concepts</p>

            <p className="mt-0.5 text-sm font-semibold">{concepts.length}</p>
          </div>

          <div>
            <p className="text-xs text-(--muted)">Connections</p>

            <p className="mt-0.5 text-sm font-semibold">{edges.length}</p>
          </div>
        </div>

        <Link
          href="/concepts"
          className="
                        text-sm font-medium
                        text-(--accent)
                        transition
                        hover:text-(--accent-hover)
                    "
        >
          Explore Knowledge Base →
        </Link>
      </div>
    </div>
  );
}
