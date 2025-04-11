import mongoose from "mongoose"
import validator from "validator"
import { type } from "os"

mongoose.connect("mongodb://localhost:27017/authentication")
.then(()=>console.log("Database Connected"))
.catch((err)=>{console.log("Connection failed")})

const schema = mongoose.Schema({
    Name : {
        type : String,
        required : true,
        maxlength : 30
    },
    PRN : {
        type : Number,
        required : true,
        unique : true
    },
    Mobile : {
        type : Number,
        required : true,
        //minlength : 10,
        //maxlength : 10
    },
    Age : {
        type : Number,
        required : true,
        //min : 18,
        //max : 30
        validate: {
            validator: function(v){
                return v.toString().length == 2;
            },
            message : "Age invalid"
        }
        
    },
    Email : {
        type : String,
        required : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    Address : {
        type : String   ,
        required : true,
        
    },
    Dept : {
        type : String,
        
    },
    URL : {
        type : String
    }
})



const user = mongoose.model("Users",schema)
export {user}