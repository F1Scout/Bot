export interface ErgastStandings {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    StandingsTable: {
      driverId: string;
      StandingsLists: {
        season: string;
        round: string;
        DriverStandings: {
          position: string;
          positionText: string;
          points: string;
          wins: string;
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
          Constructors: {
            constructorId: string;
            url: string;
            name: string;
            nationality: string;
          }[];
        }[];
      }[];
    };
  };
}
