"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchExperiment } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ExperimentDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const { data: experiment, isLoading, error } = useQuery({
    queryKey: ["experiment", id],
    queryFn: () => fetchExperiment(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error || !experiment) {
    return <div className="text-red-500">Failed to load experiment.</div>;
  }

  const variant = experiment.status.toLowerCase() === "completed" ? "default" : experiment.status.toLowerCase() === "failed" ? "destructive" : "secondary";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{experiment.experiment_name}</h2>
          <Badge variant={variant as any} className="ml-2">{experiment.status}</Badge>
        </div>
        <Button render={<Link href={`/experiments/${id}/edit`} />} nativeButton={false}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Model</span>
              <span className="font-medium">{experiment.model_name || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Dataset</span>
              <span className="font-medium">{experiment.dataset_name || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Dataset Version</span>
              <span className="font-medium">{experiment.dataset_version || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Created At</span>
              <span className="font-medium">{new Date(experiment.created_at).toLocaleString()}</span>
            </div>
            {experiment.description && (
              <div className="pt-2">
                <span className="text-muted-foreground block mb-1">Description</span>
                <p className="text-sm">{experiment.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {experiment.tags.length > 0 ? (
              experiment.tags.map(tag => (
                <Badge key={tag.id} variant="outline">{tag.name}</Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No tags.</span>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            {experiment.metrics.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {experiment.metrics.map(metric => (
                  <div key={metric.id} className="bg-muted p-4 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-sm text-muted-foreground mb-1">{metric.metric_name}</span>
                    <span className="text-2xl font-bold">{metric.metric_value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No metrics recorded.</span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            {experiment.parameters.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {experiment.parameters.map(param => (
                    <TableRow key={param.id}>
                      <TableCell className="font-medium">{param.parameter_name}</TableCell>
                      <TableCell>{param.parameter_value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <span className="text-sm text-muted-foreground">No parameters recorded.</span>
            )}
          </CardContent>
        </Card>
      </div>

      {experiment.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {experiment.notes.markdown_content}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
