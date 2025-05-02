const express = require("express");
const dotenv = require('dotenv');
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const cors = require('cors');
const pollRoutes = require("./routes/pollroutes.js");
const Poll_Routes = require("./routes/poll_routes.js");
const slackRoutes = require("./routes/slack_routes.js");





const app = express();
dotenv.config();

require("./utils/recurringPollRunner.js");


// database connect
connectDB();


//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(cors({
    origin: ['https://foodie-c255.onrender.com','http://lunch.cvt.s3-website.ap-south-1.amazonaws.com', 'http://localhost:5173'], // Trusted origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // if cookies or auth headers are involved
}));



// //Routes

app.use(require("./routes/auth"));
app.use(require("./routes/swiggy.js"));
app.use("/api/polls", Poll_Routes);
app.use(require("./routes/poll_routes.js"))
app.use("/api/slack", slackRoutes);
app.use("/api", pollRoutes);
// app.use(require("./routes/slack_routes.js"))


const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Server is running");
  });
  

app.listen(PORT, () => {
    console.log(`server start at port ${PORT}`);
});






