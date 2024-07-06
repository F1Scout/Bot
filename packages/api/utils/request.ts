import type { ErgastData } from "../interfaces/ergast/ErgastData";
import { DriverService } from "../services/driver";

export class ErgastClient {
  public driver: DriverService;
  protected readonly baseUrl: string;

  constructor(baseUrl: string = "https://ergast.com/api/f1") {
    this.baseUrl = baseUrl;
    this.driver = new DriverService(this);
  }

  /**
   * Fetch data from the Ergast API
   *
   * @param path The Ergast path to fetch data from
   * @param [limit] How many items to fetch (optional, default 1000)
   * @param [offset] The offset to start fetching from (optional, default 0)
   * @returns {Promise<ErgastData>}
   */
  async fetch(
    path: string,
    limit: number = 1000,
    offset: number = 0
  ): Promise<ErgastData | null> {
    const url = `${this.baseUrl}/${path}.json?limit=${limit}&offset=${offset}`;
    // console.log(`Fetching data from ${url}`);
    try {
      const response = await fetch(url);
      return await response.json() as ErgastData;
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error}`);
      return null;
    }
  }
}
