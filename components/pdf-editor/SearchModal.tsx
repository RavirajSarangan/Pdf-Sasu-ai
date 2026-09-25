"use client";

import React, { useState } from "react";
import { Search, ChevronUp, ChevronDown, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfTextData: { pageIndex: number; text: string }[];
  onJumpToPage: (pageIndex: number) => void;
  activePageIndex: number;
}

export function SearchModal({
  isOpen,
  onClose,
  pdfTextData,
  onJumpToPage,
  activePageIndex,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  if (!isOpen) return null;

  // Filter matches
  const matches = query.trim()
    ? pdfTextData.flatMap((page) => {
        const text = page.text;
        const q = query.toLowerCase();
        const results: { pageIndex: number; snippet: string }[] = [];
        let index = text.toLowerCase().indexOf(q);

        while (index !== -1 && results.length < 20) {
          const start = Math.max(0, index - 30);
          const end = Math.min(text.length, index + query.length + 30);
          const snippet = (start > 0 ? "..." : "") + text.substring(start, end) + (end < text.length ? "..." : "");
          results.push({
            pageIndex: page.pageIndex,
            snippet,
          });
          index = text.toLowerCase().indexOf(q, index + 1);
        }
        return results;
      })
    : [];

  const handleNext = () => {
    if (matches.length === 0) return;
    const next = (currentMatchIndex + 1) % matches.length;
    setCurrentMatchIndex(next);
    onJumpToPage(matches[next].pageIndex);
  };

  const handlePrev = () => {
    if (matches.length === 0) return;
    const prev = (currentMatchIndex - 1 + matches.length) % matches.length;
    setCurrentMatchIndex(prev);
    onJumpToPage(matches[prev].pageIndex);
  };

  const handleSelectMatch = (idx: number) => {
    setCurrentMatchIndex(idx);
    onJumpToPage(matches[idx].pageIndex);
  };

  return (
    <div className="absolute top-16 right-6 z-40 w-96 rounded-2xl bg-white border border-neutral-200 shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
        <Search className="w-4 h-4 text-neutral-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCurrentMatchIndex(0);
          }}
          placeholder="Search text in PDF..."
          className="flex-1 bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
          autoFocus
        />
        {query && (
          <span className="text-xs text-neutral-400 font-mono px-1.5">
            {matches.length > 0 ? `${currentMatchIndex + 1}/${matches.length}` : "0 results"}
          </span>
        )}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={matches.length === 0}
            className="p-1 rounded-md hover:bg-neutral-100 disabled:opacity-30"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={matches.length === 0}
            className="p-1 rounded-md hover:bg-neutral-100 disabled:opacity-30"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {query && (
        <div className="mt-2 max-h-56 overflow-y-auto space-y-1">
          {matches.length === 0 ? (
            <div className="text-xs text-neutral-400 text-center py-4">No occurrences found</div>
          ) : (
            matches.map((m, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectMatch(idx)}
                className={`p-2 rounded-lg text-xs cursor-pointer transition-colors flex items-start gap-2 ${
                  currentMatchIndex === idx
                    ? "bg-blue-50 text-blue-900 font-medium"
                    : "hover:bg-neutral-100 text-neutral-600"
                }`}
              >
                <span className="px-1.5 py-0.5 rounded bg-neutral-200 text-[10px] font-mono shrink-0">
                  p.{m.pageIndex + 1}
                </span>
                <span className="truncate">{m.snippet}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
