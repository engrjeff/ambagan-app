"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
  placeholder?: string;
  className?: string;
  paramName?: string;
  debounceMs?: number;
}

export function SearchField({
  placeholder = "Search...",
  className,
  paramName = "search",
  debounceMs = 300,
}: SearchFieldProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchValue, setSearchValue] = useState(searchParams.get(paramName) || "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);

      if (searchValue.trim()) {
        newParams.set(paramName, searchValue.trim());
      } else {
        newParams.delete(paramName);
      }

      // Reset to first page when searching
      newParams.delete("page");

      // Update URL with new search params
      const newUrl = `${pathname}?${newParams.toString()}`;
      router.replace(newUrl);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchValue, searchParams, router, pathname, paramName, debounceMs]);

  const handleClear = () => {
    setSearchValue("");
  };

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pr-9 pl-9"
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-muted absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
          onClick={handleClear}
        >
          <XIcon className="h-3 w-3" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
