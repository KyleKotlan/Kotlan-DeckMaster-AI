export interface DeckDimensions {
  length: number; // in feet
  width: number; // in feet
  height: number; // in inches
  material: DeckMaterial;
  additionalDetails?: string;
}

export enum DeckMaterial {
  PRESSURE_TREATED = 'Pressure Treated Lumber',
  CEDAR = 'Cedar',
  COMPOSITE = 'Composite',
  REDWOOD = 'Redwood'
}

export interface MaterialItem {
  name: string;
  quantity: number;
  unit: string;
  notes: string;
}

export interface MaterialCategory {
  categoryName: string;
  items: MaterialItem[];
}

export interface DeckProjectData {
  dimensions: DeckDimensions;
  materials: MaterialCategory[];
  estimatedCost?: string;
  advice?: string;
}