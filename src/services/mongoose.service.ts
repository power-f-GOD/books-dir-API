import mongoose from 'mongoose';
import debug from 'debug';

const log = debug('books-dir:mongoose-service');

class MongooseService {
  mongoose = mongoose;
  private mongooseConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000,
    useFindAndModify: false
  };

  constructor() {
    this.connect();
  }

  connect(message?: string, timeout?: number) {
    log(message || 'Attempting MongoDB connection...');

    setTimeout(async () => {
      try {
        if (process.env.DB_CONNECTION) {
          const connection = await this.mongoose.connect(
            process.env.DB_CONNECTION,
            this.mongooseConnectOptions
          );

          if (connection) {
            return log('MongoDB Connected!');
          }

          this.connect(
            'MongoDB connection failed! Retrying in 3 seconds...',
            3000
          );
        }

        throw Error('DB_CONNECTION env variable not set yet!');
      } catch (e) {
        log(e.message);
      }
    }, timeout || 0);
  }
}

export default new MongooseService();
