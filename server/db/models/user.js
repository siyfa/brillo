const { Model } = require('objection');
const bcrypt = require("bcrypt");

class User extends Model {
  static get tableName() {
    return 'users';
  }

  $beforeInsert() {
    this.createdAt = new Date();
  }
  
  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  async $beforeInsert() {
    const saltRounds = 10;
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
  }

  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

}

module.exports = User;