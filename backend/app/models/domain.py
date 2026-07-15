from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

experiment_tag_table = Table(
    "experiment_tag",
    Base.metadata,
    Column("experiment_id", Integer, ForeignKey("experiments.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    experiment_name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    model_name = Column(String, index=True, nullable=True)
    dataset_name = Column(String, index=True, nullable=True)
    dataset_version = Column(String, nullable=True)
    status = Column(String, index=True, default="Running") # e.g. Running, Completed, Failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    metrics = relationship("Metric", back_populates="experiment", cascade="all, delete-orphan")
    parameters = relationship("Parameter", back_populates="experiment", cascade="all, delete-orphan")
    tags = relationship("Tag", secondary=experiment_tag_table, back_populates="experiments")
    notes = relationship("Note", back_populates="experiment", uselist=False, cascade="all, delete-orphan")

class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False, index=True)
    metric_name = Column(String, index=True, nullable=False)
    metric_value = Column(Float, nullable=False)

    experiment = relationship("Experiment", back_populates="metrics")

class Parameter(Base):
    __tablename__ = "parameters"

    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False, index=True)
    parameter_name = Column(String, index=True, nullable=False)
    parameter_value = Column(String, nullable=False)

    experiment = relationship("Experiment", back_populates="parameters")

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    experiments = relationship("Experiment", secondary=experiment_tag_table, back_populates="tags")

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey("experiments.id", ondelete="CASCADE"), unique=True, nullable=False)
    markdown_content = Column(Text, nullable=False)

    experiment = relationship("Experiment", back_populates="notes")
