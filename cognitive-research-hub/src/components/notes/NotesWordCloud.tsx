"use client";

import { useEffect, useMemo, useState } from "react";

type WordCloudNote = {
  content: string;
};

type WordCount = {
  word: string;
  count: number;
};

type PositionedWord = WordCount & {
  x: number;
  y: number;
  rotation: number;
  size: number;
  color: string;
};

type NotesWordCloudProps = {
  notes: WordCloudNote[];
};

const STOP_WORDS = new Set([
  "the",
  "and",
  "that",
  "this",
  "with",
  "from",
  "into",
  "about",
  "which",
  "their",
  "there",
  "these",
  "those",
  "have",
  "has",
  "had",
  "were",
  "was",
  "are",
  "been",
  "being",
  "will",
  "would",
  "could",
  "should",
  "than",
  "then",
  "them",
  "they",
  "your",
  "you",
  "our",
  "for",
  "not",
  "but",
  "can",
  "also",
  "only",
  "more",
  "some",
  "very",
  "its",
  "it's",

  "der",
  "die",
  "das",
  "und",
  "oder",
  "ist",
  "sind",
  "war",
  "wird",
  "werden",
  "mit",
  "von",
  "für",
  "auf",
  "aus",
  "eine",
  "einer",
  "eines",
  "ein",
  "im",
  "in",
  "zu",
  "den",
  "dem",
  "des",
  "sich",
  "auch",
  "als",
  "wie",
  "über",
  "noch",
  "nicht",
  "nur",
  "durch",
  "bei",
  "dass",
]);

const ROTATIONS = [0, 0, 0, -8, 8, -12, 12, -5, 5];

const COLORS = [
  "rgb(245 158 11)",
  "rgb(96 165 250)",
  "rgb(167 139 250)",
  "rgb(45 212 191)",
];

function getWordCounts(notes: WordCloudNote[]): WordCount[] {
  const counts = new Map<string, number>();

  for (const note of notes) {
    const cleanedText = note.content
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, " ");

    const words = cleanedText
      .split(/\s+/)
      .map((word) => word.trim())
      .filter((word) => word.length >= 4 && !STOP_WORDS.has(word));

    for (const word of words) {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([word, count]) => ({
      word,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 40);
}

function rectanglesOverlap(
  a: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  },
  b: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  },
  padding = 8,
) {
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  );
}

export default function NotesWordCloud({ notes }: NotesWordCloudProps) {
  const words = useMemo(() => getWordCounts(notes), [notes]);

  const [positionedWords, setPositionedWords] = useState<PositionedWord[]>([]);

  useEffect(() => {
    if (words.length === 0) {
      setPositionedWords([]);
      return;
    }

    const calculatePositions = () => {
      const isMobile = window.innerWidth < 640;

      /*
       * Keep the coordinate system independent from
       * the actual rendered size of the container.
       */
      const containerWidth = isMobile ? 340 : 760;
      const containerHeight = isMobile ? 300 : 410;

      const maxCount = words[0]?.count ?? 1;
      const minCount = words[words.length - 1]?.count ?? 1;

      const placed: PositionedWord[] = [];

      for (let index = 0; index < words.length; index++) {
        const word = words[index];

        /*
         * More frequent words receive a larger font size.
         */
        const normalized =
          maxCount === minCount
            ? 0.5
            : (word.count - minCount) / (maxCount - minCount);

        const size = 15 + normalized * 30;

        const rotation =
          ROTATIONS[(index * 5 + word.word.length) % ROTATIONS.length];

        const estimatedWidth = word.word.length * size * 0.52;
        const estimatedHeight = size * 1.25;

        let foundPosition = false;

        /*
         * Build the cloud from the center outward.
         */
        for (let radius = 0; radius < 300 && !foundPosition; radius += 6) {
          const attempts = radius === 0 ? 1 : 18;

          for (let attempt = 0; attempt < attempts; attempt++) {
            const angle = (attempt / attempts) * Math.PI * 2 + index * 0.85;

            /*
             * Use an elliptical distribution so the
             * cloud better matches the brain silhouette.
             */
            const centerX =
              containerWidth / 2 + Math.cos(angle) * radius * 1.15;

            const centerY =
              containerHeight / 2 + Math.sin(angle) * radius * 0.62;

            const rectangle = {
              left: centerX - estimatedWidth / 2,
              right: centerX + estimatedWidth / 2,
              top: centerY - estimatedHeight / 2,
              bottom: centerY + estimatedHeight / 2,
            };

            /*
             * Keep words inside the main cloud area.
             */
            const normalizedX =
              (centerX - containerWidth / 2) / (containerWidth * 0.46);

            const normalizedY =
              (centerY - containerHeight / 2) / (containerHeight * 0.43);

            const distance =
              normalizedX * normalizedX + normalizedY * normalizedY;

            if (distance > 1) {
              continue;
            }

            /*
             * Prevent words from overlapping.
             */
            const collision = placed.some((existing) => {
              const existingWidth = existing.word.length * existing.size * 0.52;

              const existingHeight = existing.size * 1.25;

              return rectanglesOverlap(
                rectangle,
                {
                  left: existing.x - existingWidth / 2,
                  right: existing.x + existingWidth / 2,
                  top: existing.y - existingHeight / 2,
                  bottom: existing.y + existingHeight / 2,
                },
                8,
              );
            });

            if (collision) {
              continue;
            }

            const color = COLORS[index % COLORS.length];

            placed.push({
              ...word,
              x: centerX,
              y: centerY,
              rotation,
              size,
              color,
            });

            foundPosition = true;
            break;
          }
        }
      }

      setPositionedWords(placed);
    };

    calculatePositions();

    window.addEventListener("resize", calculatePositions);

    return () => {
      window.removeEventListener("resize", calculatePositions);
    };
  }, [words]);

  if (words.length === 0) {
    return null;
  }

  const totalOccurrences = words.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="mt-8">
      <div
        className="
          overflow-hidden
          rounded-2xl
          border border-(--border)
          bg-(--surface)
          shadow-sm
        "
      >
        {/* Header */}
        <div
          className="
            border-b border-(--border)
            px-6 py-5
          "
        >
          <div
            className="
              flex flex-col gap-2
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-(--accent)
                "
              >
                Your Vocabulary
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Words across your notes
              </h2>

              <p className="mt-1 text-sm leading-6 text-(--muted)">
                The ideas that appear most often throughout your research.
              </p>
            </div>

            <span className="text-xs text-(--subtle)">
              {words.length} words · {totalOccurrences} occurrences
            </span>
          </div>
        </div>

        {/* Cloud */}
        <div
          className="
            relative
            flex
            justify-center
            overflow-hidden
            px-4
            py-8
            sm:px-6
            sm:py-10
          "
        >
          <div
            className="
              relative
              h-75
              w-full
              max-w-190
              sm:h-102.5
            "
          >
            {/* Brain background */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <img
                src="/brain.svg"
                alt=""
                className="
    h-[85%]
    w-[85%]
    object-contain
    opacity-[0.08]
    dark:invert
  "
              />
            </div>

            {/* Words */}
            {positionedWords.map((word, index) => (
              <span
                key={word.word}
                title={`${word.count} ${
                  word.count === 1 ? "occurrence" : "occurrences"
                }`}
                className="
                  absolute
                  whitespace-nowrap
                  font-semibold
                  tracking-tight
                  transition-all
                  duration-300
                  hover:z-20
                  hover:scale-110
                "
                style={{
                  left: `${(word.x / 760) * 100}%`,
                  top: `${(word.y / 410) * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${word.rotation}deg)`,
                  fontSize: `${word.size}px`,
                  color: word.color,
                  opacity: index < 8 ? 1 : 0.72,
                  textShadow:
                    index < 5 ? "0 0 18px rgba(255,255,255,0.08)" : "none",
                }}
              >
                {word.word}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            border-t border-(--border)
            px-6 py-3
            text-xs text-(--subtle)
          "
        >
          Larger words appear more frequently in your notes.
        </div>
      </div>
    </section>
  );
}
