import type { ConstructorData } from "./ConstructorData";

export interface DriverData {
  id: string;
  name: string;
  acronym: string;
  team: ConstructorData | null;
  dateOfBirth: string;
  nationality: string;

  stats: {
    worldChampionships: number;
    highest_race_finish: {
      position: number;
      amount: number;
    };
    highest_grid_position: {
      position: number;
      amount: number;
    };
    grand_prix_entered: number;
    podiums: number;
    points: number;
  };

  recent_results:
    | {
        // TODO: Add properties
      }[]
    | null;
}
