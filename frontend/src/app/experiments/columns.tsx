"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Experiment } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const columns: ColumnDef<Experiment>[] = [
  {
    accessorKey: "experiment_name",
    header: "Experiment",
  },
  {
    accessorKey: "model_name",
    header: "Model",
    cell: ({ row }) => row.getValue("model_name") || "-",
  },
  {
    accessorKey: "dataset_name",
    header: "Dataset",
    cell: ({ row }) => row.getValue("dataset_name") || "-",
  },
  {
    id: "accuracy",
    header: "Accuracy",
    cell: ({ row }) => {
      const metrics = row.original.metrics;
      const acc = metrics.find(m => m.metric_name.toLowerCase() === "accuracy");
      return acc ? acc.metric_value.toFixed(4) : "-";
    }
  },
  {
    id: "f1",
    header: "F1 Score",
    cell: ({ row }) => {
      const metrics = row.original.metrics;
      const f1 = metrics.find(m => m.metric_name.toLowerCase() === "f1");
      return f1 ? f1.metric_value.toFixed(4) : "-";
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = status.toLowerCase() === "completed" ? "default" : status.toLowerCase() === "failed" ? "destructive" : "secondary";
      return <Badge variant={variant as any}>{status}</Badge>;
    }
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const exp = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          } />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem render={<Link href={`/experiments/${exp.id}`} className="cursor-pointer" />}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={`/experiments/${exp.id}/edit`} className="cursor-pointer" />}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              {/* Delete will be handled in the data-table component via a passed function later, or just a simple link/action here */}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
