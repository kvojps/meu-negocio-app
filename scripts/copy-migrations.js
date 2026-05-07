const fs = require("fs");
const path = require("path");

const sourceDir = path.join(
  __dirname,
  "../app/backend/infra/database/migrations",
);
const destDir = path.join(
  __dirname,
  "../dist/app/backend/infra/database/migrations",
);

// Create destination directory
fs.mkdirSync(path.dirname(destDir), { recursive: true });

// Copy migrations folder
fs.cpSync(sourceDir, destDir, { recursive: true, force: true });

console.log(`✓ Migrations copied from ${sourceDir} to ${destDir}`);
