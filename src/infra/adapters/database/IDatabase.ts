import mongoose from 'mongoose';

export interface IDatabase {
  createDatabaseConnection(...args: any[]): Promise<void>
  getConnection(): mongoose.Connection
}