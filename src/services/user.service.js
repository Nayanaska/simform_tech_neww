const db = require("../models")
const User = db.users;
const Op = db.Sequelize.Op;
module.exports = class UserService {
	constructor() {
		this.create = this.create.bind(this);
		this.getByCondition = this.getByCondition.bind(this);
		this.update = this.update.bind(this);
	}
	async create(user) {
        return new Promise((resolve,reject)=>{
          User.create(user).then(data=>{
              resolve(data)
          },err=>{
              reject(err)
          })
        })
	
	}

  async getByCondition(condition) {
    return new Promise((resolve,reject)=>{
      User.findOne(condition).then(data=>{
          resolve(data)
      },err=>{
          reject(err)
      })
    })

}

async update(condition,body) {
  return new Promise((resolve,reject)=>{
    User.update(body,condition).then(data=>{
        resolve(data)
    },err=>{
        reject(err)
    })
  })

}
}


