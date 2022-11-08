require("dotenv").config();
require('../config/database').connect();
const http = require("http");
const graphqlHttp = require("express-graphql")
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const User = require('../model/user');
const auth = require('../middleware/auth');
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");



const httpServer = createServer();
const io = new Server(httpServer);
const myschema = require("../model/graphqlSchema")
io.on("connection", (socket) => {
  socket.connected
});

// middleawres
app.use(express.json());
app.use(cookieParser());


app.use("/graphql", graphqlHttp({
    myschema,
    pretty:true,
    graphiql: true
}));

// for handling all the 404 error 
app.use('*', (req, res) => {
    return res.status(404).json({
      success: false,
      message: 'API endpoint doesnt exist'
    })
  });
  

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.post('/register', async (req,res) =>{
    try {
        const {userName , email , password} = req.body;

        if(!(userName && email && password)){
            res.status(400).send("All fields are required");
        }

        const existingUser = await User.findOne({email});

        if (existingUser) {
            res.status(401).send("User already exits");
        }

        const myEncPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName , 
            email: email.toLowerCase(),
            password: myEncPassword
        })

        //token
        var token = jwt.sign(
            { user_id : user._id , email }, 
            process.env.SECRET_KEY,
            {expiresIn: '2h'}
        );

        user.token = token;
        user.password = undefined; // we don't want password o be retured as a response

        res.status(201).json(user)
    } catch (error) {
        console.log(error);
    }

});

app.post('/login', async (req,res) =>{
   try {
        const {email, password} = req.body;

        if(!(email && password)){
            res.status(400).send("Oops any of the fields are missing.");
        }

        const user = await User.findOne({email})
        console.log(user);

        if(user && bcrypt.compare(password, user.password)){
            const token = jwt.sign(
                { user_id : user._id , email }, 
                process.env.SECRET_KEY,
                {expiresIn: '2h'}
            )
            user.token = token;
            user.password = undefined;
            // res.status(200).json(user)

            // if u want to use cookies

            const options = {
                expires : new Date(Date.now() + 3 *24*60*60*1000),
                httpOnly: true,
            };
            res.status(200).cookie("token", token, options).json({
                success: true,
                token,
                user
            });
        }
        res.status(400).send("You have entered inccorect credentials.");
   } catch (error) {
        console.log(error);
   }

})

app.get('/dashboard',auth, (req,res) =>{
    res.send("This is a restricted route")
})

// creating http server
const server = http.createServer(app);




 
module.exports = app, httpServer;