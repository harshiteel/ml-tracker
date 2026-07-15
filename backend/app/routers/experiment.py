from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas import ExperimentCreate, ExperimentUpdate, ExperimentResponse
from app.services.experiment import ExperimentService

router = APIRouter(prefix="/experiments", tags=["Experiments"])

def get_experiment_service(db: Session = Depends(get_db)) -> ExperimentService:
    return ExperimentService(db)

@router.post("", response_model=ExperimentResponse, status_code=status.HTTP_201_CREATED)
def create_experiment(
    experiment_in: ExperimentCreate,
    service: ExperimentService = Depends(get_experiment_service)
):
    return service.create_experiment(experiment_in)

@router.get("/search", response_model=List[ExperimentResponse])
def search_experiments(
    query: str = None,
    model_name: str = None,
    dataset_name: str = None,
    status: str = None,
    tags: str = None, # comma separated
    start_date: str = None,
    end_date: str = None,
    min_accuracy: float = None,
    max_accuracy: float = None,
    sort_by: str = "date",
    sort_order: str = "desc",
    skip: int = 0, limit: int = 100,
    service: ExperimentService = Depends(get_experiment_service)
):
    tag_list = tags.split(",") if tags else None
    return service.search_experiments(
        query=query,
        model_name=model_name,
        dataset_name=dataset_name,
        status=status,
        tags=tag_list,
        start_date=start_date,
        end_date=end_date,
        min_accuracy=min_accuracy,
        max_accuracy=max_accuracy,
        sort_by=sort_by,
        sort_order=sort_order,
        skip=skip,
        limit=limit
    )

@router.get("", response_model=List[ExperimentResponse])
def get_experiments(
    skip: int = 0, limit: int = 100,
    service: ExperimentService = Depends(get_experiment_service)
):
    return service.get_experiments(skip, limit)

@router.get("/{experiment_id}", response_model=ExperimentResponse)
def get_experiment(
    experiment_id: int,
    service: ExperimentService = Depends(get_experiment_service)
):
    return service.get_experiment(experiment_id)

@router.put("/{experiment_id}", response_model=ExperimentResponse)
def update_experiment(
    experiment_id: int,
    exp_update: ExperimentUpdate,
    service: ExperimentService = Depends(get_experiment_service)
):
    return service.update_experiment(experiment_id, exp_update)

@router.delete("/{experiment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experiment(
    experiment_id: int,
    service: ExperimentService = Depends(get_experiment_service)
):
    service.delete_experiment(experiment_id)
    return None
