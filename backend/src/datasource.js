// datasource.js

const { DataSource } = require("typeorm");

const dataSourceOptions = {
  "type": "postgres",
  "url": "postgres://localhost/woofwatch-store",
  "extra": {},
  "models": [
    "dist/models/*.js"
  ],
  "migrations": [
    "dist/migrations/*.js"
  ]
}

module.exports = {
  datasource: new DataSource(dataSourceOptions)
}