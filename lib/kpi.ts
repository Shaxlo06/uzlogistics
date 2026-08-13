export const KPI_CONFIG: Record<
  string,
  { titleKey: string; color: string; goodWhenNegative: boolean }
> = {
  logistics_cost_index: { titleKey: "kpi.logisticsCost", color: "#3b82f6", goodWhenNegative: true },
  delivery_speed: { titleKey: "kpi.deliverySpeed", color: "#10b981", goodWhenNegative: false },
  transit_efficiency: { titleKey: "kpi.transitEfficiency", color: "#8b5cf6", goodWhenNegative: false },
  processing_speed: { titleKey: "kpi.processingSpeed", color: "#f59e0b", goodWhenNegative: false },
  monitoring_accuracy: { titleKey: "kpi.monitoringAccuracy", color: "#e87ba4", goodWhenNegative: false },
};

export const KPI_ORDER = [
  "logistics_cost_index",
  "delivery_speed",
  "transit_efficiency",
  "processing_speed",
  "monitoring_accuracy",
];
