export const DBEnviron = [
  { name: "MYSQL_ROOT_PASSWORD", desc: "set root Password", req: true },
  {
    name: "MYSQL_ALLOW_EMPTY_PASSWORD",
    desc: "give non-empty value",
    req: true,
  },
  {
    name: "MYSQL_RANDOM_ROOT_PASSWORD",
    desc: "give non-empty value",
    req: true,
  },
  { name: "MYSQL_ROOT_HOST", desc: 'create root user with "%"', req: true },
  { name: "MYSQL_DATABASE", desc: "create database", req: true },
  { name: "MYSQL_USER", desc: "create user", req: true },
  { name: "MYSQL_PASSWORD", desc: "set MYSQL_USER password", req: true },
];
export const NPMEnviron = [
  {
    name: "DB_MYSQL_HOST",
    desc: "set Database Service NPM will use",
    req: true,
  },
  { name: "DB_MYSQL_PORT", desc: "set Database's PORT", req: true },
  { name: "DB_MYSQL_USER", desc: "set DatabaseUser NPM will use", req: true },
  {
    name: "DB_MYSQL_PASSWORD",
    desc: "set DatabaseUser's Password NPM will use",
    req: true,
  },
  { name: "DB_MYSQL_NAME", desc: "set Database NPM will use", req: true },
];
export const dbFilter = ["db", "mariadb", "mysql", "postgre"];
export const nginxProxyManagerFilter = ["proxy", "npm"];
