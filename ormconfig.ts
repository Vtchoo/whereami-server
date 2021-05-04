import { ConnectionOptions } from "typeorm"
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions"

type DBType = "mysql" | "mariadb" | "postgres" | "cockroachdb" | "sqlite" | "mssql" | "sap" | "oracle" | "cordova" | "nativescript" | "react-native" | "sqljs" | "mongodb" | "aurora-data-api" | "aurora-data-api-pg" | "expo" | "better-sqlite3"
type MySQLType = 'mysql' | 'mariadb'

// const ormconfig: ConnectionOptions = {
const ormconfig: MysqlConnectionOptions = {
    type: <MySQLType>process.env.DB_ENG || 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false,
    migrations: ['./src/database/migrations/**.ts'],
    entities: ['./src/models/**.ts'],
    cli: {
        migrationsDir: './src/database/migrations',
    },
    migrationsRun: false,
    //timezone: 'Z'   // holy shit this solved the timezone issue (https://github.com/typeorm/typeorm/issues/976#issuecomment-386925989)
}

export default ormconfig