const bcrypt = require('bcryptjs')

let data = [
    {
      "id": 1,
      "email": "gregxgod@gmail.com",
      "password": "test",
      "role": "Admin",
    }
  ]

  console.log(data);
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('data[0].password', salt);

  data[0].password = hash;
  console.log(data[0]);