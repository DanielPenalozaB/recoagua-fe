"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Block } from "@/types/block";
import { Check, X, RefreshCw, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RelationalPairsBlockProps {
  readonly block: Block;
  readonly onChange: (pairs: number[]) => void;
  readonly isSubmitted: boolean;
}

interface Item {
  id: string; // "L-1", "R-1" to distinguish sides
  text: string;
  pairId: number; // The original pair ID from DB
  side: "left" | "right";
}

interface Match {
  left: Item;
  right: Item;
}

export default function RelationalPairsBlock({
  block,
  onChange,
  isSubmitted,
}: RelationalPairsBlockProps) {
  const [leftItems, setLeftItems] = useState<Item[]>([]);
  const [rightItems, setRightItems] = useState<Item[]>([]);

  const [selectedLeft, setSelectedLeft] = useState<Item | null>(null);
  const [selectedRight, setSelectedRight] = useState<Item | null>(null);

  const [matches, setMatches] = useState<Match[]>([]);

  // No internal submission state needed
  // const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize and shuffle
  useEffect(() => {
    if (block.relationalPairs) {
      const lefts: Item[] = block.relationalPairs.map((p) => ({
        id: `L-${p.id}`,
        text: p.leftItem,
        pairId: Number(p.id),
        side: "left",
      }));

      const rights: Item[] = block.relationalPairs.map((p) => ({
        id: `R-${p.id}`,
        text: p.rightItem,
        pairId: Number(p.id),
        side: "right",
      }));

      setLeftItems(shuffleArray(lefts));
      setRightItems(shuffleArray(rights));
    }
  }, [block]);

  // Attempt to form a match when both sides are selected
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      // Create new match
      const newMatch: Match = {
        left: selectedLeft,
        right: selectedRight,
      };

      // Add to matches
      setMatches((prev) => [...prev, newMatch]);

      // Remove from available items
      setLeftItems((prev) => prev.filter((i) => i.id !== selectedLeft.id));
      setRightItems((prev) => prev.filter((i) => i.id !== selectedRight.id));

      // Reset selection
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  }, [selectedLeft, selectedRight]);

  // Bubble up matches whenever they change
  useEffect(() => {
    const correctMatches = matches.filter(
      (m) => m.left.pairId === m.right.pairId,
    );
    const correctPairIds = correctMatches.map((m) => m.left.pairId);
    onChange(correctPairIds);
  }, [matches, onChange]);

  const handleUnmatch = (matchIndex: number) => {
    if (isSubmitted) return;

    const matchToRemove = matches[matchIndex];

    // Return items to available lists
    setLeftItems((prev) => [...prev, matchToRemove.left]);
    setRightItems((prev) => [...prev, matchToRemove.right]);

    // Remove from matches
    setMatches((prev) => prev.filter((_, i) => i !== matchIndex));
  };

  const handleReset = () => {
    if (isSubmitted) return;

    // Re-initialize from props effectively by clearing matches and triggering effect?
    // Easier to just rebuild from current block data + shuffle again.
    if (block.relationalPairs) {
      const lefts: Item[] = block.relationalPairs.map((p) => ({
        id: `L-${p.id}`,
        text: p.leftItem,
        pairId: Number(p.id),
        side: "left",
      }));

      const rights: Item[] = block.relationalPairs.map((p) => ({
        id: `R-${p.id}`,
        text: p.rightItem,
        pairId: Number(p.id),
        side: "right",
      }));

      setLeftItems(shuffleArray(lefts));
      setRightItems(shuffleArray(rights));
      setMatches([]);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  // Removed handleSubmit

  return (
    <div className="space-y-8 select-none">
      {block.description && (
        <p className="text-gray-700">{block.description}</p>
      )}

      {/* Available Items Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-3">
          <h3 className="font-semibold text-center text-gray-500 text-sm uppercase tracking-wider mb-2">
            Columna A
          </h3>
          <div className="space-y-3 min-h-[200px]">
            {leftItems.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  !isSubmitted &&
                  setSelectedLeft(selectedLeft?.id === item.id ? null : item)
                }
                disabled={isSubmitted}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]",
                  selectedLeft?.id === item.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 bg-white hover:border-blue-300",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-gray-100 rounded text-gray-400">
                    <GripVertical size={16} />
                  </div>
                  <span className="text-gray-800 font-medium">{item.text}</span>
                </div>
              </button>
            ))}
            {leftItems.length === 0 && !isSubmitted && matches.length > 0 && (
              <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-sm">
                Todos los elementos seleccionados
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h3 className="font-semibold text-center text-gray-500 text-sm uppercase tracking-wider mb-2">
            Columna B
          </h3>
          <div className="space-y-3 min-h-[200px]">
            {rightItems.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  !isSubmitted &&
                  setSelectedRight(selectedRight?.id === item.id ? null : item)
                }
                disabled={isSubmitted}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]",
                  selectedRight?.id === item.id
                    ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                    : "border-gray-200 bg-white hover:border-purple-300",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-800 font-medium flex-1">
                    {item.text}
                  </span>
                  <div className="p-1 bg-gray-100 rounded text-gray-400">
                    <GripVertical size={16} />
                  </div>
                </div>
              </button>
            ))}
            {rightItems.length === 0 && !isSubmitted && matches.length > 0 && (
              <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-sm">
                Todos los elementos seleccionados
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Matches Area */}
      {matches.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-700">
              Pares formados ({matches.length})
            </h3>
            {!isSubmitted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-gray-500 hover:text-red-600"
              >
                <RefreshCw size={14} className="mr-2" />
                Reiniciar
              </Button>
            )}
          </div>

          <div className="grid gap-3">
            {matches.map((match, idx) => {
              const isCorrect = match.left.pairId === match.right.pairId;
              // If submitted, show green/red border. If not, show neutral blue.
              let borderColor = "border-blue-200 bg-blue-50/50";
              if (isSubmitted) {
                borderColor = isCorrect
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50";
              }

              return (
                <div
                  key={`${match.left.id}-${match.right.id}`}
                  className={cn(
                    "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all group",
                    borderColor,
                  )}
                >
                  <div className="flex-1 font-medium text-gray-800">
                    {match.left.text}
                  </div>

                  {/* Connection Icon */}
                  <div className="px-4 text-gray-400 flex flex-col items-center">
                    {(() => {
                      if (!isSubmitted)
                        return <div className="w-8 h-0.5 bg-blue-300" />;
                      return isCorrect ? (
                        <Check className="text-green-600" />
                      ) : (
                        <X className="text-red-600" />
                      );
                    })()}
                  </div>

                  <div className="flex-1 font-medium text-gray-800 text-right">
                    {match.right.text}
                  </div>

                  {/* Unmatch button (only if not submitted) */}
                  {!isSubmitted && (
                    <button
                      onClick={() => handleUnmatch(idx)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                      title="Deshacer par"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
