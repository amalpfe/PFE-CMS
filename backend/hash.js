// hash.js
const bcrypt = require("bcrypt");

const plainPassword = "admin123"; // 👈 Your chosen admin password

bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log("Hashed password:", hash);
});
// bcrypt.hash('test123', 10).then(hash => {
//   console.log(hash);
// });