"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchExperiments, Experiment } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ComparePage() {
  const [expAId, setExpAId] = useState<string>("");
  const [expBId, setExpBId] = useState<string>("");

  const { data: experiments, isLoading } = useQuery({
    queryKey: ["experiments", ""],
    queryFn: () => fetchExperiments({}),
  });

  if (isLoading) {
    return <Skeleton className="w-full h-96" />;
  }

  const expA = experiments?.find((e: Experiment) => e.id.toString() === expAId);
  const expB = experiments?.find((e: Experiment) => e.id.toString() === expBId);

  // Get all unique metric names from both experiments
  const allMetricNames = Array.from(
    new Set([
      ...(expA?.metrics.map(m => m.metric_name) || []),
      ...(expB?.metrics.map(m => m.metric_name) || []),
    ])
  );

  return (
    <div className="space-y-6 flex-1">
      <h2 className="text-3xl font-bold tracking-tight">Compare Experiments</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Experiment A</CardTitle>
            <Select value={expAId} onValueChange={(val) => setExpAId(val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select experiment" />
              </SelectTrigger>
              <SelectContent>
                {experiments?.map((e: Experiment) => (
                  <SelectItem key={e.id} value={e.id.toString()}>{e.experiment_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experiment B</CardTitle>
            <Select value={expBId} onValueChange={(val) => setExpBId(val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select experiment" />
              </SelectTrigger>
              <SelectContent>
                {experiments?.map((e: Experiment) => (
                  <SelectItem key={e.id} value={e.id.toString()}>{e.experiment_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
        </Card>
      </div>

      {(expA || expB) && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="w-1/3">{expA?.experiment_name || "None Selected"}</TableHead>
                  <TableHead className="w-1/3">{expB?.experiment_name || "None Selected"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allMetricNames.map(metricName => {
                  const valA = expA?.metrics.find(m => m.metric_name === metricName)?.metric_value;
                  const valB = expB?.metrics.find(m => m.metric_name === metricName)?.metric_value;

                  // Simple logic: Assuming higher is better. In a real app, you might configure this.
                  const isABetter = valA !== undefined && valB !== undefined && valA > valB;
                  const isBBetter = valA !== undefined && valB !== undefined && valB > valA;

                  return (
                    <TableRow key={metricName}>
                      <TableCell className="font-medium">{metricName}</TableCell>
                      <TableCell className={isABetter ? "text-green-600 font-bold dark:text-green-400" : ""}>
                        {valA !== undefined ? valA.toFixed(4) : "-"}
                      </TableCell>
                      <TableCell className={isBBetter ? "text-green-600 font-bold dark:text-green-400" : ""}>
                        {valB !== undefined ? valB.toFixed(4) : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
