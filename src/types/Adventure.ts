export type Adventure = {
  id: number;
  title: string;
  description: string;
  characters: string[];
  plotLines: string[];
  themes: ThemeValues[];
  notes: string;
  turningPoints: TurningPoint[];
};

export type TurningPoint = {
  id: number;
  title: string;
  notes: string;
  plotLine: string;
  charactersInvolved: string[];
  plotPoints: string[];
};

export type ThemeValues =
  | "tension"
  | "action"
  | "mystery"
  | "social"
  | "personal";
