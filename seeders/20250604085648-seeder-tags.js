'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      { tagName: 'general' },
      { tagName: 'caber' },
      { tagName: 'caberInstructor' },
      { tagName: 'compareCode' },
      { tagName: 'JSON' },
      { tagName: 'MD' },
      { tagName: 'DarkWeb' },
      { tagName: 'codingBersama' },
    ]

    data = data.map(el=>{
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    await queryInterface.bulkInsert('Tags', data, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tags', null, {})
  }
};
