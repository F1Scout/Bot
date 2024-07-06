export interface ErgastResults {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable: {
      driverId: string;
      Races: {
        season: string;
        round: string;
        url: string;
        raceName: string;
        Circuit: {
          circuitId: string;
          url: string;
          circuitName: string;
          Location: {
            lat: string;
            long: string;
            locality: string;
            country: string;
          };
        };
        date: string;
        time: string;
        Results: {
          number: string;
          position: string;
          positionText: string;
          points: string;
          Driver: {
            driverId: string;
            permanentNumber: string;
            code: string;
            url: string;
            givenName: string;
            familyName: string;
            dateOfBirth: string;
            nationality: string;
          };
          Constructor: {
            constructorId: string;
            url: string;
            name: string;
            nationality: string;
          };
          grid: string;
          laps: string;
          status: string;
          Time: {
            millis: string;
            time: string;
          };
          FastestLap: {
            rank: string;
            lap: string;
            Time: {
              time: string;
            };
            AverageSpeed: {
              units: string;
              speed: string;
            };
          };
        }[];
      }[];
    };
  };
}
