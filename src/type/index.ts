export interface ApiResponse<Result> {
  Action: string;
  Error: number;
  Desc: string;
  Version: string;
  Result: Result;
}

export interface ApiAllVcResult {
  list: Object[];
}
