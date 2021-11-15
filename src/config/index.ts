import { resolve } from 'path';
import { ValidateNested, ValidationError, validateSync } from 'class-validator';
import { config } from 'dotenv';
import { APP } from './app.config';
import { AWS } from './aws.config';
import { DB } from './db.config';

config({ path: resolve(__dirname, '../../.env') });

class Config {
  @ValidateNested()
  APP = APP;

  @ValidateNested()
  DB = DB;

  @ValidateNested()
  AWS = AWS;
}

export const CONFIG = new Config();

const validationErrors = validateSync(CONFIG);

if (validationErrors.length > 0) {
  console.error('ERROR: Environment variables validation has failed:');

  const printConfigErrors = (validationErrors: ValidationError[]) => {
    for (const validationError of validationErrors) {
      if (validationError.constraints) {
        for (const errorMessage of Object.values(validationError.constraints)) {
          console.error(`  ${errorMessage}`);
        }
      }

      if (validationError.children) {
        printConfigErrors(validationError.children);
      }
    }
  };

  printConfigErrors(validationErrors);

  process.exit(1);
}
