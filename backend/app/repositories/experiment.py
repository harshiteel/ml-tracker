from sqlalchemy.orm import Session
from sqlalchemy import select, and_, or_, desc, asc
from typing import List, Optional
from datetime import datetime
from app.models.domain import Experiment, Metric, Parameter, Tag, Note, experiment_tag_table
from app.schemas import ExperimentCreate, ExperimentUpdate

class ExperimentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Experiment]:
        stmt = select(Experiment).order_by(Experiment.created_at.desc()).offset(skip).limit(limit)
        return self.db.execute(stmt).scalars().unique().all()

    def get_by_id(self, experiment_id: int) -> Optional[Experiment]:
        stmt = select(Experiment).where(Experiment.id == experiment_id)
        return self.db.execute(stmt).scalars().unique().first()

    def search(
        self,
        query: Optional[str] = None,
        model_name: Optional[str] = None,
        dataset_name: Optional[str] = None,
        status: Optional[str] = None,
        tags: Optional[List[str]] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        min_accuracy: Optional[float] = None,
        max_accuracy: Optional[float] = None,
        sort_by: str = "date",
        sort_order: str = "desc",
        skip: int = 0,
        limit: int = 100
    ) -> List[Experiment]:
        stmt = select(Experiment)

        # Filters
        if query:
            stmt = stmt.where(
                or_(
                    Experiment.experiment_name.ilike(f"%{query}%"),
                    Experiment.model_name.ilike(f"%{query}%"),
                    Experiment.dataset_name.ilike(f"%{query}%")
                )
            )
        if model_name:
            stmt = stmt.where(Experiment.model_name == model_name)
        if dataset_name:
            stmt = stmt.where(Experiment.dataset_name == dataset_name)
        if status:
            stmt = stmt.where(Experiment.status == status)
        if start_date:
            stmt = stmt.where(Experiment.created_at >= start_date)
        if end_date:
            stmt = stmt.where(Experiment.created_at <= end_date)
        
        if tags:
            for tag in tags:
                stmt = stmt.where(Experiment.tags.any(Tag.name == tag))

        if min_accuracy is not None or max_accuracy is not None:
            # Join with metric table to filter by accuracy
            stmt = stmt.join(Metric, and_(Metric.experiment_id == Experiment.id, Metric.metric_name.ilike("accuracy")))
            if min_accuracy is not None:
                stmt = stmt.where(Metric.metric_value >= min_accuracy)
            if max_accuracy is not None:
                stmt = stmt.where(Metric.metric_value <= max_accuracy)

        # Sorting
        if sort_by == "accuracy":
            # Ensure join if not already joined
            if min_accuracy is None and max_accuracy is None:
                stmt = stmt.outerjoin(Metric, and_(Metric.experiment_id == Experiment.id, Metric.metric_name.ilike("accuracy")))
            
            order_col = Metric.metric_value
            stmt = stmt.order_by(desc(order_col) if sort_order == "desc" else asc(order_col), desc(Experiment.created_at))
        elif sort_by == "name":
            order_col = Experiment.experiment_name
            stmt = stmt.order_by(desc(order_col) if sort_order == "desc" else asc(order_col))
        else: # default to date
            order_col = Experiment.created_at
            stmt = stmt.order_by(desc(order_col) if sort_order == "desc" else asc(order_col))

        stmt = stmt.offset(skip).limit(limit)
        return self.db.execute(stmt).scalars().unique().all()

    def _get_or_create_tag(self, tag_name: str) -> Tag:
        stmt = select(Tag).where(Tag.name == tag_name)
        tag = self.db.execute(stmt).scalar_one_or_none()
        if not tag:
            tag = Tag(name=tag_name)
            self.db.add(tag)
            self.db.commit()
            self.db.refresh(tag)
        return tag

    def create(self, experiment_in: ExperimentCreate) -> Experiment:
        db_exp = Experiment(
            experiment_name=experiment_in.experiment_name,
            description=experiment_in.description,
            model_name=experiment_in.model_name,
            dataset_name=experiment_in.dataset_name,
            dataset_version=experiment_in.dataset_version,
            status=experiment_in.status
        )
        self.db.add(db_exp)
        self.db.flush() # flush to get db_exp.id

        # Add metrics
        for m in experiment_in.metrics:
            db_metric = Metric(**m.model_dump(), experiment_id=db_exp.id)
            self.db.add(db_metric)

        # Add parameters
        for p in experiment_in.parameters:
            db_param = Parameter(**p.model_dump(), experiment_id=db_exp.id)
            self.db.add(db_param)

        # Add notes
        if experiment_in.notes:
            db_note = Note(markdown_content=experiment_in.notes, experiment_id=db_exp.id)
            self.db.add(db_note)

        # Add tags
        for t_name in experiment_in.tags:
            tag = self._get_or_create_tag(t_name)
            db_exp.tags.append(tag)

        self.db.commit()
        self.db.refresh(db_exp)
        return db_exp

    def update(self, db_exp: Experiment, exp_update: ExperimentUpdate) -> Experiment:
        update_data = exp_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_exp, key, value)
        
        self.db.commit()
        self.db.refresh(db_exp)
        return db_exp

    def delete(self, db_exp: Experiment) -> None:
        self.db.delete(db_exp)
        self.db.commit()
