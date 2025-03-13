export type Tasks = Task[];
export interface Task {
  id:       string,
  label:    string,
  finished: boolean,
}

export interface FilterTask {
  event: Event,
  index: number,
}

export type FilterStatusType = 'ALL' | 'COMPLETE' | 'INCOMPLETE';
export type FilterOptions = FilterOption[];
export interface FilterOption {
  value: FilterStatusType,
  label: string, 
}