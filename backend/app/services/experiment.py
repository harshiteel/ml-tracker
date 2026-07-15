from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from app.repositories.experiment import ExperimentRepository
from app.schemas import ExperimentCreate, ExperimentUpdate, ExperimentResponse
from app.models.domain import Experiment

class ExperimentService:
    def __init__(self, db: Session):
        self.repo = ExperimentRepository(db)

    def get_experiments(self, skip: int = 0, limit: int = 100) -> List[Experiment]:
        return self.repo.get_all(skip, limit)

    def search_experiments(
        self,
        query: str = None,
        model_name: str = None,
        dataset_name: str = None,
        status: str = None,
        tags: List[str] = None,
        start_date: str = None,
        end_date: str = None,
        min_accuracy: float = None,
        max_accuracy: float = None,
        sort_by: str = "date",
        sort_order: str = "desc",
        skip: int = 0,
        limit: int = 100
    ) -> List[Experiment]:
        return self.repo.search(
            query=query,
            model_name=model_name,
            dataset_name=dataset_name,
            status=status,
            tags=tags,
            start_date=start_date,
            end_date=end_date,
            min_accuracy=min_accuracy,
            max_accuracy=max_accuracy,
            sort_by=sort_by,
            sort_order=sort_order,
            skip=skip,
            limit=limit
        )

    def get_experiment(self, experiment_id: int) -> Experiment:
        exp = self.repo.get_by_id(experiment_id)
        if not exp:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experiment not found")
        return exp

    def create_experiment(self, experiment_in: ExperimentCreate) -> Experiment:
        return self.repo.create(experiment_in)

    def update_experiment(self, experiment_id: int, exp_update: ExperimentUpdate) -> Experiment:
        db_exp = self.get_experiment(experiment_id)
        return self.repo.update(db_exp, exp_update)

    def delete_experiment(self, experiment_id: int) -> None:
        db_exp = self.get_experiment(experiment_id)
        self.repo.delete(db_exp)
