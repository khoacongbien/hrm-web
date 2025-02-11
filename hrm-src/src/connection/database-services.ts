import { ConnectionPool, config as SQLConfig, IResult } from "mssql";

class DatabaseService {
  private pool: ConnectionPool;

  constructor() {
    const dbConfig: SQLConfig = {
      user: process.env.DB_USER || "hris",
      password: process.env.DB_PASS || "Nhansu2022",
      server: process.env.DB_HOST || "192.168.60.13",
      database: process.env.DB_NAME || "HRIS_TX2",
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    };

    this.pool = new ConnectionPool(dbConfig);
  }

  async connect() {
    if (!this.pool.connected) {
      await this.pool.connect();
    }
  }

  async disconnect() {
    if (this.pool.connected) {
      await this.pool.close();
    }
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    await this.connect();
    const request = this.pool.request();
    if (params && params.length > 0) {
      params.forEach((value, index) => {
        request.input(`param${index}`, value);
      });
    }
    const result: IResult<T> = await request.query(sql);
    return result.recordset;
  }

  async queryFirst<T>(sql: string, params?: any[]): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  async execute<T>(sql: string, params?: any[]): Promise<T> {
    await this.connect();
    const request = this.pool.request();
    if (params && params.length > 0) {
      params.forEach((value, index) => {
        request.input(`param${index}`, value);
      });
    }
    const result: IResult<T> = await request.query(sql);
    return result as any;
  }
}

export default new DatabaseService();
