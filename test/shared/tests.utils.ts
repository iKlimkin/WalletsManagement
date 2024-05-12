import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { configApp } from '../../src/config/configApp';

const truncateDBTables = async (app: INestApplication, dbOwnerUserName: string) => {
  const dataSource = await app.resolve(DataSource);

  await dataSource.query(
    `
            CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
            DECLARE
                statements CURSOR FOR
                    SELECT tablename FROM pg_tables
                    WHERE tableowner = username AND schemaname = 'public';
            BEGIN
                FOR stmt IN statements LOOP
                    EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
                END LOOP;
            END;
            $$ LANGUAGE plpgsql;

            SELECT truncate_tables('${dbOwnerUserName}');
        `,
  );
};

export const getAppForE2ETesting = async () => {
  const appModule: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = appModule.createNestApplication();
  const httpServer = app.getHttpServer();
  configApp(app);
  await app.init();
  await truncateDBTables(app, 'postgres');

  return { app, httpServer };
};
