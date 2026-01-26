"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, X } from "lucide-react";

interface JobSearchProps {
  onSearch: (query: string, location: string) => void;
  initialQuery?: string;
  initialLocation?: string;
}

interface RecentSearch {
  query: string;
  location: string;
  timestamp: number;
}

export function JobSearch({
  onSearch,
  initialQuery = "",
  initialLocation = "",
}: JobSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [showRecent, setShowRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [focusedInput, setFocusedInput] = useState<"query" | "location" | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("linkedinJobSearchHistory");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowRecent(false);
        setFocusedInput(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveSearch = (searchQuery: string, searchLocation: string) => {
    if (!searchQuery.trim()) return;

    const newSearch: RecentSearch = {
      query: searchQuery.trim(),
      location: searchLocation.trim(),
      timestamp: Date.now(),
    };

    // Remove duplicate and add to beginning
    const filtered = recentSearches.filter(
      (s) => s.query !== newSearch.query || s.location !== newSearch.location
    );
    const updated = [newSearch, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("linkedinJobSearchHistory", JSON.stringify(updated));
  };

  const handleSearch = () => {
    saveSearch(query, location);
    onSearch(query, location);
    setShowRecent(false);
    setFocusedInput(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const selectRecentSearch = (search: RecentSearch) => {
    setQuery(search.query);
    setLocation(search.location);
    setShowRecent(false);
    setFocusedInput(null);
    onSearch(search.query, search.location);
  };

  const removeRecentSearch = (
    e: React.MouseEvent,
    searchToRemove: RecentSearch
  ) => {
    e.stopPropagation();
    const updated = recentSearches.filter(
      (s) =>
        s.query !== searchToRemove.query ||
        s.location !== searchToRemove.location
    );
    setRecentSearches(updated);
    localStorage.setItem("linkedinJobSearchHistory", JSON.stringify(updated));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("linkedinJobSearchHistory");
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2 p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-sm">
        {/* Job Title Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search job titles, companies, or keywords"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setFocusedInput("query");
              if (recentSearches.length > 0) setShowRecent(true);
            }}
            onKeyDown={handleKeyDown}
            className="pl-10 h-11"
          />
        </div>

        {/* Location Input */}
        <div className="relative w-64">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
          <Input
            placeholder="City, state, or zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => {
              setFocusedInput("location");
              if (recentSearches.length > 0) setShowRecent(true);
            }}
            onKeyDown={handleKeyDown}
            className="pl-10 h-11"
          />
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="h-11 px-6">
          Search
        </Button>
      </div>

      {/* Recent Searches Dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
            <span className="text-sm font-medium text-[var(--muted-foreground)]">
              Recent searches
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllRecent}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] h-auto p-0"
            >
              Clear all
            </Button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {recentSearches.map((search, index) => (
              <div
                key={`${search.query}-${search.timestamp}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-[var(--muted)]/50 cursor-pointer group"
                onClick={() => selectRecentSearch(search)}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
                  <div>
                    <p className="text-sm font-medium">{search.query}</p>
                    {search.location && (
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {search.location}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => removeRecentSearch(e, search)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
