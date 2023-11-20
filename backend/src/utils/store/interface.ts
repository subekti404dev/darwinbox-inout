export interface IStore {
  setConfigData: (data: any) => void;
  getConfigData: () => any;
  addLogData: (log: any) => void;
  getLogData: () => any;
}
