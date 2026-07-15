"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchExperiments } from "@/services/api";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export default function ExperimentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: experiments, isLoading, error } = useQuery({
    queryKey: ["experiments", debouncedSearch],
    queryFn: () => fetchExperiments({ query: debouncedSearch }),
  });

  return (
    <div className="space-y-6 flex-1">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Experiments</h2>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search experiments, models, datasets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {/* Filters can go here later */}
      </div>

      {error ? (
        <div className="text-red-500">Failed to load experiments.</div>
      ) : isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={experiments || []} />
      )}
    </div>
  );
}
