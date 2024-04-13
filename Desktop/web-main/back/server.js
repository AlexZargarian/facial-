const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost", 
    user: "root",
    password: "Aa09120304072", 
    database: "kms2"
});
//api for signup
app.post('/signup', (req,res)=>{
    const sql ="INSERT INTO login ('name', 'email', 'password' ) VALUES(?) ";

const values=[
    req.body.name,
    req.body.email,
    req.body.password
]
console.log('sdsd')
    db.query(sql, [values], (err,data)=> {
        console.log("a")
        if(err){
            return res.json("Error")
            console.log("b")
            
        }
        console.log("c")
        return res.json(data);
       

    })
}
)







app.post('/login', (req,res)=>{
    const sql ="SELECT *  FROM  login WHERE 'email'= ? AND 'password'= ?";


    db.query(sql, [req.body.email, req.body.password], (err,data)=> {
        if(err){
            return res.json("Error")
        }
        if (data.lenght>0){
            return res.json("Success");
        }
        else{
            return res.json("Fail");
        }

    })
}
)


app.listen(8081,()=>{
    console.log("listening")
}
)
