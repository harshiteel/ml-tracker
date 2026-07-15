"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const experimentSchema = z.object({
  experiment_name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  model_name: z.string().optional(),
  dataset_name: z.string().optional(),
  dataset_version: z.string().optional(),
  status: z.string(),
  tags: z.string().optional(), // Will be transformed to string[]
  notes: z.string().optional(),
  metrics: z.array(
    z.object({
      metric_name: z.string().min(1, "Metric name is required"),
      metric_value: z.coerce.number(),
    })
  ),
  parameters: z.array(
    z.object({
      parameter_name: z.string().min(1, "Parameter name is required"),
      parameter_value: z.string().min(1, "Value is required"),
    })
  ),
});

type ExperimentFormValues = z.infer<typeof experimentSchema>;

interface ExperimentFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function ExperimentForm({ initialData, onSubmit, isSubmitting }: ExperimentFormProps) {
  const form = useForm<ExperimentFormValues>({
    resolver: zodResolver(experimentSchema) as any,
    defaultValues: initialData ? {
      ...initialData,
      tags: initialData.tags?.map((t: any) => t.name).join(", ") || "",
      notes: initialData.notes?.markdown_content || "",
    } : {
      experiment_name: "",
      description: "",
      model_name: "",
      dataset_name: "",
      dataset_version: "",
      status: "Running",
      tags: "",
      notes: "",
      metrics: [{ metric_name: "Accuracy", metric_value: 0 }],
      parameters: [{ parameter_name: "learning_rate", parameter_value: "0.001" }],
    },
  });

  const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({
    control: form.control,
    name: "metrics",
  });

  const { fields: paramFields, append: appendParam, remove: removeParam } = useFieldArray({
    control: form.control,
    name: "parameters",
  });

  const handleSubmit = (data: ExperimentFormValues) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    };
    onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="experiment_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experiment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ResNet50-V1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Running">Running</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="model_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ResNet50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataset_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dataset</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ImageNet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataset_version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dataset Version</FormLabel>
                    <FormControl>
                      <Input placeholder="v1.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="vision, classification, experimental" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          {/* Metrics */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Metrics</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => appendMetric({ metric_name: "", metric_value: 0 })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Metric
                </Button>
              </div>
              {metricFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`metrics.${index}.metric_name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Name (e.g. F1)" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`metrics.${index}.metric_value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="number" step="0.0001" placeholder="Value" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeMetric(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Parameters */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Parameters</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => appendParam({ parameter_name: "", parameter_value: "" })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Param
                </Button>
              </div>
              {paramFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`parameters.${index}.parameter_name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Name (e.g. epochs)" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`parameters.${index}.parameter_value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Value (e.g. 100)" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeParam(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[150px]" placeholder="# Observations..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Experiment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
