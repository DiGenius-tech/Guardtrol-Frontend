const dotenv = require("dotenv");
const NODE_ENV = process.env.NODE_ENV || "development";

dotenv.config({ path: `.env.${NODE_ENV}` });
console.log(`Loaded environment variables from .env.${NODE_ENV}`);
console.log(process.env.REACT_APP_ASSET_URL);
