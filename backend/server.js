const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const cors = require('cors');


const app = express();
dotenv.config();


// database connect
connectDB();


//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(cors({
    origin: ['https://yourproductiondomain.com', 'http://localhost:5173'], // Trusted origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // if cookies or auth headers are involved
}));



// //Routes
app.use(require("./routes/auth"));
app.use(require("./routes/zomato"));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server start at port ${PORT}`);
});


