"use client";

import { ExperimentForm } from "@/components/experiments/experiment-form";
import { useRouter } from "next/navigation";
import { createExperiment } from "@/services/api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function NewExperimentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createExperiment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Experiment created successfully!");
      router.push("/experiments");
    },
    onError: () => {
      toast.error("Failed to create experiment.");
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">New Experiment</h2>
      <ExperimentForm 
        onSubmit={(data) => mutation.mutate(data)} 
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
