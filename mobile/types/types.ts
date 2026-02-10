export interface PlanItem {
  id: string;
  emoji: string;
  label: string;
}

export interface PlanCategory {
  title: string;
  items: PlanItem[];
}