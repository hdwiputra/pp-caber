'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {
        "id": 1,
        "username": "gregXGOD",
        "imageUrl": "https://i.pinimg.com/474x/47/ba/71/47ba71f457434319819ac4a7cbd9988e.jpg",
        "UserId": 1,
      }
    ]

    data = data.map(el=>{
      delete el.id;
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    await queryInterface.bulkInsert('Accounts', data, {})
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Accounts', null, {})
  }
};
