from sqlalchemy.orm import Session
from sqlalchemy import func, select, desc
from datetime import datetime, timedelta
from app.models.domain import Experiment, Metric

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_stats(self):
        # Total experiments
        total_experiments = self.db.execute(select(func.count(Experiment.id))).scalar() or 0

        # Most used model
        most_used_model_stmt = (
            select(Experiment.model_name)
            .group_by(Experiment.model_name)
            .order_by(desc(func.count(Experiment.id)))
            .limit(1)
        )
        most_used_model = self.db.execute(most_used_model_stmt).scalar()

        # Most used dataset
        most_used_dataset_stmt = (
            select(Experiment.dataset_name)
            .group_by(Experiment.dataset_name)
            .order_by(desc(func.count(Experiment.id)))
            .limit(1)
        )
        most_used_dataset = self.db.execute(most_used_dataset_stmt).scalar()

        # Average Accuracy
        avg_accuracy_stmt = (
            select(func.avg(Metric.metric_value))
            .where(Metric.metric_name.ilike("accuracy"))
        )
        avg_accuracy = self.db.execute(avg_accuracy_stmt).scalar() or 0.0

        # Average F1
        avg_f1_stmt = (
            select(func.avg(Metric.metric_value))
            .where(Metric.metric_name.ilike("f1"))
        )
        avg_f1 = self.db.execute(avg_f1_stmt).scalar() or 0.0

        # Best Experiment (highest accuracy)
        best_exp_stmt = (
            select(Experiment)
            .join(Metric)
            .where(Metric.metric_name.ilike("accuracy"))
            .order_by(desc(Metric.metric_value))
            .limit(1)
        )
        best_experiment = self.db.execute(best_exp_stmt).scalars().first()

        # Latest Experiment
        latest_exp_stmt = select(Experiment).order_by(desc(Experiment.created_at)).limit(1)
        latest_experiment = self.db.execute(latest_exp_stmt).scalars().first()

        # Experiments this month
        first_day_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        experiments_this_month = self.db.execute(
            select(func.count(Experiment.id)).where(Experiment.created_at >= first_day_of_month)
        ).scalar() or 0

        return {
            "total_experiments": total_experiments,
            "most_used_model": most_used_model,
            "most_used_dataset": most_used_dataset,
            "average_accuracy": round(avg_accuracy, 4),
            "average_f1": round(avg_f1, 4),
            "best_experiment_name": best_experiment.experiment_name if best_experiment else None,
            "latest_experiment_name": latest_experiment.experiment_name if latest_experiment else None,
            "experiments_this_month": experiments_this_month
        }
