declare module 'sql.js' {
  export interface SqlJsStatic {
    Database: {
      new(data?: Uint8Array | ArrayBuffer | Buffer | number[]): Database;
    };
  }

  export interface SqlJsStatement {
    run(params?: unknown[]): void;
    bind(params?: unknown[]): boolean;
    step(): boolean;
    get(): unknown[];
    free(): void;
  }

  export interface SqlJsResultSet {
    columns: string[];
    values: unknown[][];
  }

  export class Database {
    constructor(data?: Uint8Array | ArrayBuffer | Buffer | number[]);
    run(sql: string): void;
    exec(sql: string): SqlJsResultSet[];
    prepare(sql: string): SqlJsStatement;
    export(): Uint8Array;
  }

  export interface SqlJsInitConfig {
    locateFile?: (file: string) => string;
  }

  const initSqlJs: (config?: SqlJsInitConfig) => Promise<SqlJsStatic>;

  export default initSqlJs;
}