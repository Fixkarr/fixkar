const fs = require("fs");

// banknames.json read karo
const raw = JSON.parse(fs.readFileSync("banknames.json", "utf-8"));

// object → array + isActive add
const result = Object.entries(raw).map(([code, name]) => ({
  code,
  name,
  isActive: true
}));

// new file likho
fs.writeFileSync(
  "banks.json",
  JSON.stringify(result, null, 2)
);

console.log("banks.json created successfully");
