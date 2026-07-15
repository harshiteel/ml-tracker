"use client";

import { ExperimentForm } from "@/components/experiments/experiment-form";
import { useParams, useRouter } from "next/navigation";
import { fetchExperiment, updateExperiment } from "@/services/api";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditExperimentPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: experiment, isLoading, error } = useQuery({
    queryKey: ["experiment", id],
    queryFn: () => fetchExperiment(id),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => updateExperiment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiment", id] });
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Experiment updated successfully!");
      router.push(`/experiments/${id}`);
    },
    onError: () => {
      toast.error("Failed to update experiment.");
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !experiment) {
    return <div className="text-red-500">Failed to load experiment.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Edit Experiment</h2>
      <ExperimentForm 
        initialData={experiment}
        onSubmit={(data) => mutation.mutate(data)} 
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
