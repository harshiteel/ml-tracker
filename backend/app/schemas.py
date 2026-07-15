from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# --- Tags ---
class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Metrics ---
class MetricBase(BaseModel):
    metric_name: str
    metric_value: float

class MetricCreate(MetricBase):
    pass

class MetricResponse(MetricBase):
    id: int
    experiment_id: int
    model_config = ConfigDict(from_attributes=True)

# --- Parameters ---
class ParameterBase(BaseModel):
    parameter_name: str
    parameter_value: str

class ParameterCreate(ParameterBase):
    pass

class ParameterResponse(ParameterBase):
    id: int
    experiment_id: int
    model_config = ConfigDict(from_attributes=True)

# --- Notes ---
class NoteBase(BaseModel):
    markdown_content: str

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    pass

class NoteResponse(NoteBase):
    id: int
    experiment_id: int
    model_config = ConfigDict(from_attributes=True)

# --- Experiments ---
class ExperimentBase(BaseModel):
    experiment_name: str
    description: Optional[str] = None
    model_name: Optional[str] = None
    dataset_name: Optional[str] = None
    dataset_version: Optional[str] = None
    status: str = "Running"

class ExperimentCreate(ExperimentBase):
    metrics: List[MetricCreate] = []
    parameters: List[ParameterCreate] = []
    tags: List[str] = [] # just the tag names
    notes: Optional[str] = None

class ExperimentUpdate(BaseModel):
    experiment_name: Optional[str] = None
    description: Optional[str] = None
    model_name: Optional[str] = None
    dataset_name: Optional[str] = None
    dataset_version: Optional[str] = None
    status: Optional[str] = None

class ExperimentResponse(ExperimentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    metrics: List[MetricResponse] = []
    parameters: List[ParameterResponse] = []
    tags: List[TagResponse] = []
    notes: Optional[NoteResponse] = None
    
    model_config = ConfigDict(from_attributes=True)
