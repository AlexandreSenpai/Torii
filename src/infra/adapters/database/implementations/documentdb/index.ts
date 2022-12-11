import { IDatabase } from '../../IDatabase';
import path from 'path';
import mongoose from 'mongoose';
import { environment_name } from '../../../../../utils/config';

class DocumentDB implements IDatabase{

  private connectionString: string = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/?useUnifiedTopology=false`

  getConnection(): mongoose.Connection {
    return mongoose.connection;
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  async createDatabaseConnection(databaseOptions?: { dbName: string }): Promise<void> {
    await mongoose.connect(this.connectionString, {
      dbName: databaseOptions?.dbName || process.env.DB_NAME,
      ssl: !['local', 'test'].includes(environment_name),
      sslValidate: false,
      retryWrites: false,
      sslCA: path.join(__dirname, './certificates/rds-combined-ca-bundle.pem'),
      auth: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      }
    });
  }
}

export default new DocumentDB();