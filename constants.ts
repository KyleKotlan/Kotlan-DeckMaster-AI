import { DeckMaterial } from "./types";

export const DEFAULT_DIMENSIONS = {
  length: 12,
  width: 10,
  height: 24,
  material: DeckMaterial.PRESSURE_TREATED,
  additionalDetails: ''
};

export const MATERIAL_OPTIONS = [
  { value: DeckMaterial.PRESSURE_TREATED, label: 'Pressure Treated (Standard)' },
  { value: DeckMaterial.CEDAR, label: 'Cedar (Premium Natural)' },
  { value: DeckMaterial.REDWOOD, label: 'Redwood (Premium Natural)' },
  { value: DeckMaterial.COMPOSITE, label: 'Composite (Low Maintenance)' },
];