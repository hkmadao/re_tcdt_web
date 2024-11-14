declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}
declare interface Window {
  tcdtAPI: {
    generateEntityFull: (url: string) => void;
    generateEntityPart: (url: string) => void;
    generateComponentEnumPart: (url: string) => void;
    generateComponentEnumFull: (url: string) => void;
    generateComponentCombination: (url: string) => void;
    generateComponentSingle: (url: string) => void;
    generateDtoModule: (url: string) => void;
    generateInputFull: (url: string) => void;
    generateInputPart: (url: string) => void;
    generateOutputFull: (url: string) => void;
    generateOutputPart: (url: string) => void;
    generateBillForm: (url: string) => void;
    singleComponentBatchGenerate: (
      params: { url: string; name: string }[],
    ) => void;
    enumComponentBatchGenerate: (
      params: { url: string; name: string }[],
    ) => void;
    combinationComponentBatchGenerate: (
      params: { url: string; name: string }[],
    ) => void;
    fetchConf: () => any;
    saveConf: (conf: any) => any;
    resetConf: () => any;
    removeConf: (conf: any) => any;
    selectPath: (defalutPath?: string) => any;
    findDbTables: (param: any) => any;
    executeSql: (param: any) => any;
  };
}
