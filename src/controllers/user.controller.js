const User= require("../services/user.service")
const commonFunction= require("../utils/commonFunction")
const userService= new User()


module.exports = class UserController {
	constructor() {
		this.register = this.register.bind(this);
		this.login = this.login.bind(this);
		this.getUser = this.getUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
	}
	async register(req, res, next) {
		let email = req.body.email || ""
        let firstName = req.body.firstName || ""
        let lastName = req.body.lastName || ""
        let password = req.body.password || ""
        let errors = []
        if (email === "") {
            errors.push({
                errField: "email",
                errText: "email is required!"
            });
        }
        if (firstName === "") {
            errors.push({
                errField: "firstName",
                errText: "FirstName is required!"
            });
        }
        if (lastName === "") {
            errors.push({
                errField: "lastName",
                errText: "lastName is required!"
            });
        }
        if (password === "") {
            errors.push({
                errField: "password",
                errText: "password is required!"
            });
        }
        if (errors.length > 0) {
            res.status(400).json({message:"Validation Errors",data:errors})

        } else {
			let payload={email,firstName,lastName,password:commonFunction.getBcryptEncryption(password)}
            await userService.create(payload).then(
				data=>{
					res.status(200).json({message:"User Registered Successfully",data:{}})
				},
				err=>{
					res.status(400).json({message:"Unable to register user",data:err})
				}
			)
        }
	
	}

	async login(req, res, next) {
		let email = req.body.email || ""
        let password = req.body.password || ""
        let errors = []
        if (email === "") {
            errors.push({
                errField: "email",
                errText: "email is required!"
            });
        }
        if (password === "") {
            errors.push({
                errField: "password",
                errText: "password is required!"
            });
        }
        if (errors.length > 0) {
            res.status(400).json({message:"Validation Errors",data:errors})

        } else {
			let payload={email,raw:true}
            await userService.getByCondition(payload).then(
				data=>{
					if(!data){
						res.status(200).json({message:"User does not exist",data:{}})
					}else{
						let match= commonFunction.compareBcryptEncryption(password,data.password)
						if(match){
							let userData=data
							userData["authToken"]=commonFunction.getJwtEncryption(data)
							res.status(200).json({message:"Login Successful",data:userData})
						}else{
							res.status(400).json({message:"Password Incorrect",data:{}})

						}
					}
				},
				err=>{
					res.status(400).json({message:"Unable to login user",data:err})
				}
			)
        }
	
	}

	async getUser(req, res, next) {
		let id= req.user.id || null
		
        let errors = []
        if (id === null) {
            errors.push({
                errField: "id",
                errText: "id is required!"
            });
        }
        if (errors.length > 0) {
            res.status(400).json({message:"Validation Errors",data:errors})

        } else {
			let payload={raw:true, where:{id}, attributes:{exclude:['password','createdAt','updatedAt']}}
            await userService.getByCondition(payload).then(
				data=>{
					res.status(200).json({message:"user fetched successfully",data})
				},err=>{
					res.status(400).json({message:"Unable to fetch user",data:err})
				}
			)
        }
	
	}

	async updateUser(req, res, next) {
		let id= req.user.id || null
		let firstName = req.body.firstName || ""
        let lastName = req.body.lastName || ""
		let email = req.body.email || ""
		let files = req.files || null
        let errors = []
        if (id === null) {
            errors.push({
                errField: "id",
                errText: "id is required!"
            });
        }
		if (firstName === "") {
            errors.push({
                errField: "firstName",
                errText: "FirstName is required!"
            });
        }
        if (lastName === "") {
            errors.push({
                errField: "lastName",
                errText: "lastName is required!"
            });
        }
		if (email === "") {
            errors.push({
                errField: "email",
                errText: "email is required!"
            });
        }
		if (files && files.image && !commonFunction.isFileTypeImage(files.image.mimetype)) {
			errors.push({ errField: "image", errText: "INVALID_IMAGE_FORMAT" });
		}
        if (errors.length > 0) {
            res.status(400).json({message:"Validation Errors",data:errors})

        } else {
			let condition={raw:true, where:{id}}
			let body={firstName,lastName,email}
			if(files){
				let  fileName = commonFunction.uploadFile(files.image);
				body["image"]= '/uploads/'+ fileName
			}

			
			
            await userService.update(condition,body).then(
				data=>{
					res.status(200).json({message:"user updated successfully",data})
				},err=>{
					res.status(400).json({message:"Unable to update user",data:err})
				}
			)
        }
	
	}

	async updatePassword(req, res, next) {
		let id= req.user.id || null
		let oldPassword = req.body.oldPassword || ""
        let password = req.body.password || ""
        let errors = []
        if (id === null) {
            errors.push({
                errField: "id",
                errText: "id is required!"
            });
        }
		if (oldPassword === "") {
            errors.push({
                errField: "oldPassword",
                errText: "oldPassword is required!"
            });
        }
        if (password === "") {
            errors.push({
                errField: "password",
                errText: "password is required!"
            });
        }
        if (errors.length > 0) {
            res.status(400).json({message:"Validation Errors",data:errors})

        } else {
			let condition={raw:true, where:{id}}

			await userService.getByCondition(condition).then(
				async(data)=>{
					let match= await commonFunction.compareBcryptEncryption(oldPassword,data.password)
				
						if(match){
							let condition={raw:true, where:{id}}
							let body= {password: await commonFunction.getBcryptEncryption(password)}							
							
							await userService.update(condition,body).then(
								data=>{
									res.status(200).json({message:"password updated successfully",data:{}})
								},err=>{
									res.status(400).json({message:"Unable to update password",data:err})
								}
							)
						}else{
							res.status(400).json({message:"Old Password Incorrect",data:{}})

						}

				},err=>{
					res.status(400).json({message:"Unable to update password",data:err})
				}	
			)

        }
	
	}
}


