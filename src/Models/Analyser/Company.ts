//Holds Data pertaining to a specific year like the revenue of 2020
export class Company{
  name: string;
  quarter: number;
  year: number;
  data: Map<string,number>;  // Stores Revenue, EPS, Debt, etc
}

//Holds Data pertaining to a specific company, for all of its years
export class CompanyResults{
  id: number;
  name: string;
  period: string; // quarterly or yearly
  results: Company[] = [];  //For storing year 2020, 2019, 2018 etc
}