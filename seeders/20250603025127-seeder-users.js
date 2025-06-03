'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = [
      {
        "id": 1,
        "email": "gregxgod@gmail.com",
        "password": "admin",
        "role": "Admin",
      }
    ]

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data[0].password, salt);
    data[0].password = hash;

    data = data.map(el=>{
      delete el.id;
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    await queryInterface.bulkInsert('Users', data, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
