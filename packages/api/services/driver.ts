import type { DriverData } from "../interfaces/DriverData";
import type { ErgastDriver } from "../interfaces/ergast/ErgastDriver";
import type { ErgastResults } from "../interfaces/ergast/ErgastResults";
import type { ErgastStandings } from "../interfaces/ergast/ErgastStandings";
import type { ErgastClient } from "../utils/request";

import { Result, err, ok } from "@sapphire/result";

export class DriverService {
  protected readonly client: ErgastClient;

  constructor(client: ErgastClient) {
    this.client = client;
  }

  async getDriver(
    driverId: string | number
  ): Promise<Result<DriverData, string>> {
    const [eDriver, eRaces, eStandings, eLifetimeStandings] = await Promise.all(
      [
        this.client.fetch(`drivers/${driverId}`) as unknown as ErgastDriver,
        this.client.fetch(
          `drivers/${driverId}/results`
        ) as unknown as ErgastResults,
        this.client.fetch(
          `${new Date().getFullYear()}/drivers/${driverId}/driverStandings`
        ) as unknown as ErgastStandings,
        this.client.fetch(
          `drivers/${driverId}/driverStandings`
        ) as unknown as ErgastStandings,
      ]
    );

    if (!eDriver || !eRaces || !eStandings || !eLifetimeStandings) {
      return err("No data returned from the API");
    }

    const driver = eDriver.MRData.DriverTable.Drivers[0];
    const races = eRaces.MRData.RaceTable.Races

    const worldChampionships =
      eLifetimeStandings.MRData.StandingsTable.StandingsLists.filter(
        (x) => x.DriverStandings[0].position === "1"
      ).length;

    const podiums = eRaces.MRData.RaceTable.Races.filter(
      (race) => parseInt(race.Results[0].position) <= 3
    ).length;
    const points =
      eLifetimeStandings.MRData.StandingsTable.StandingsLists.reduce(
        (acc, x) => acc + parseInt(x.DriverStandings[0].points),
        0
      );

    let highestGridPosition = Infinity;
    let highestGridPositionCount = 0;
    let highestRaceFinish = Infinity;
    let highestRaceFinishCount = 0;

    const polePositions: { [key: number]: number } = {};
    const raceFinishes: { [key: number]: number } = {};

    races.forEach(race => {
      race.Results.forEach(result => {
        const gridPosition = parseInt(result.grid);
        if (!isNaN(gridPosition) && gridPosition > 0) {
          polePositions[gridPosition] = (polePositions[gridPosition] || 0) + 1;
          if (gridPosition < highestGridPosition) {
            highestGridPosition = gridPosition;
          }
        }

        const finishPosition = parseInt(result.position);
        if (!isNaN(finishPosition) && finishPosition > 0) {
          raceFinishes[finishPosition] = (raceFinishes[finishPosition] || 0) + 1;
          if (finishPosition < highestRaceFinish) {
            highestRaceFinish = finishPosition;
          }
        }
      });
    });

    highestGridPositionCount = polePositions[highestGridPosition] || 0;
    highestRaceFinishCount = raceFinishes[highestRaceFinish] || 0;

    if (highestGridPosition === Infinity) highestGridPosition = 0;
    if (highestRaceFinish === Infinity) highestRaceFinish = 0;

    const isDriverActive = eStandings.MRData.total !== "0";

    const driverData: DriverData = {
      id: driver.driverId,
      name: `${driver.givenName} ${driver.familyName}`,
      acronym: driver.code,
      team: isDriverActive ? {
        id: eStandings.MRData.StandingsTable.StandingsLists[0]
          .DriverStandings[0].Constructors[0].constructorId,
        name: eStandings.MRData.StandingsTable.StandingsLists[0]
          .DriverStandings[0].Constructors[0].name,
        url: eStandings.MRData.StandingsTable.StandingsLists[0]
          .DriverStandings[0].Constructors[0].url,
        nationality:
          eStandings.MRData.StandingsTable.StandingsLists[0].DriverStandings[0]
            .Constructors[0].nationality,
      } : null,
      nationality: driver.nationality,
      dateOfBirth: driver.dateOfBirth,

      stats: {
        worldChampionships: worldChampionships,
        grand_prix_entered: races.length,
        highest_grid_position: {
          position: highestGridPosition,
          amount: highestGridPositionCount,
        },
        highest_race_finish: {
          position: highestRaceFinish,
          amount: highestRaceFinishCount,
        },
        podiums: podiums,
        points: points,
      },

      recent_results: null,
    };

    return ok(driverData);
  }
}