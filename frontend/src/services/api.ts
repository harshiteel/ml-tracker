import { api } from "@/lib/axios";

// Types
export interface Tag { id: number; name: string; }
export interface Metric { id: number; experiment_id: number; metric_name: string; metric_value: number; }
export interface Parameter { id: number; experiment_id: number; parameter_name: string; parameter_value: string; }
export interface Note { id: number; experiment_id: number; markdown_content: string; }

export interface Experiment {
  id: number;
  experiment_name: string;
  description?: string;
  model_name?: string;
  dataset_name?: string;
  dataset_version?: string;
  status: string;
  created_at: string;
  updated_at: string;
  metrics: Metric[];
  parameters: Parameter[];
  tags: Tag[];
  notes?: Note;
}

export interface Analytics {
  total_experiments: number;
  most_used_model: string | null;
  most_used_dataset: string | null;
  average_accuracy: number;
  average_f1: number;
  best_experiment_name: string | null;
  latest_experiment_name: string | null;
  experiments_this_month: number;
}

export const fetchAnalytics = async (): Promise<Analytics> => {
  const { data } = await api.get("/analytics");
  return data;
};

export const fetchExperiments = async (params: any): Promise<Experiment[]> => {
  const { data } = await api.get("/experiments/search", { params });
  return data;
};

export const fetchExperiment = async (id: number): Promise<Experiment> => {
  const { data } = await api.get(`/experiments/${id}`);
  return data;
};

export const createExperiment = async (payload: any): Promise<Experiment> => {
  const { data } = await api.post("/experiments", payload);
  return data;
};

export const updateExperiment = async (id: number, payload: any): Promise<Experiment> => {
  const { data } = await api.put(`/experiments/${id}`, payload);
  return data;
};

export const deleteExperiment = async (id: number): Promise<void> => {
  await api.delete(`/experiments/${id}`);
};
