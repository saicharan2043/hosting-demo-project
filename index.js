const dotenv = require("dotenv")
const mysql = require("mysql")
const express = require("express")
const app = express()

app.use(express.json())

dotenv.config({
    path : "./data/config.env"
})

const connection = mysql.createConnection({
    host:"db4free.net",
    port:3306,
    user : "shiva_kumar",
    password:"sai@1234" ,
    database:"user_details_db"
})

connection.connect(function(error){
    if (error)
        throw error
    console.log("connect database successfuly..")
})

app.post("/registration" , async(request , response) =>{
    // const {username , password} = request.body
    connection.query(`insert into user(name , user_name , password , gander)values('pawan' , 'pawan@gmail.com' , 'pawan@123' , 'male')` , (error , reslut)=>{
        if (error){
            response.status(400).json({massage : "Data not Add.."})
            console.log(error)
        }else{
            console.log("quary success")
            response.status(200).json({massage : "added successfuly.."})
        }
        
    })
    
})

app.get("/login" , (request , response)=>{
    connection.query(`select * from user` , (error , reslut) =>{
        if(error){
            response.send(error)
        }else{
            response.send(reslut)
        }
    })
})

app.listen(process.env.port , ()=>console.log(`server is running ${process.env.port}`))