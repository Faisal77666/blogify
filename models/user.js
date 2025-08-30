const { error } = require('console');
const { createHmac ,randomBytes} = require('crypto');
const { setMaxIdleHTTPParsers } = require('http');
const {createTokenForUser}=require('../service/auth')

const {Schema,model}=require('mongoose')


const userSchema=new Schema({
fullName:{
  type:String,
  required:true,
},
email:{
  type:String,
  required:true,
  unique:true,

},
salt:{
  type:String,
},
password:{
  type:String,
  required:true,
},
profileImageURL:{
  type:String,
  default:"/images/pic.jpg"
},
role:{
  type:String,
  enum:["USER","ADMIN"],
  default:"USER"
}

},
{timestamps:true}
)
userSchema.pre("save",function(next){
  const user=this
  if(!user.isModified("password")) return

  const salt=randomBytes(16).toString()
  const hashedPasword = createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');
               this.salt=salt
               this.password=hashedPasword
               next()
})
userSchema.static('matchPasswordAndGenerateToken',async function(email,password){
  const user=await this.findOne({email})
  if(!user)
 throw new Error('User not found')
console.log(user)
  const salt=user.salt
  const hashedPasword=user.password
  const userProvidedHash=createHmac('sha256', salt)
               .update(password)
               .digest('hex');
               if(hashedPasword!==userProvidedHash)
                throw new Error('Incorrect Password')
              //  return user
              const token=createTokenForUser(user)
              return token

})


const User=model("user",userSchema)

module.exports=User