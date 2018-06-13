import configuration  from "./config-env"; 
const  env = process.env.REACT_APP_NODE_ENV || "development";
let config = configuration[env];

export function getEnvironmentId() {
  return env;
}
export default config;


  