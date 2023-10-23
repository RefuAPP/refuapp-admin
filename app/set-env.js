const fs = require('fs');

const backendUrl = process.env['BACKEND_URL'];

const productionEnvironmentFile = `
export const environment = {
  production: true,
  API: "${backendUrl}",
};
`

fs.writeFile('./src/environments/environment.prod.ts', productionEnvironmentFile, err => {
  if (err) {
    console.error("Error writing environment.prod.ts file");
    console.error(err);
  } else {
    console.log(`Generated production environment file`);
  }
})
