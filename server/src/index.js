const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { serverConfig, connectDB } = require("./config");
const router = require("./routes");
const { errorHandlerMiddleware } = require("./middlewares");


const app = express();

app.use(cors({
    origin: serverConfig.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


// routes middlewares
app.use("/api", router)

// error handler middleware
app.use(errorHandlerMiddleware.errorMiddleware);

connectDB();
app.listen(serverConfig.PORT, () => {
    console.log("server is running on PORT: ",serverConfig.PORT);
});