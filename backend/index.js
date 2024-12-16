const express = require("express");
const mainRouter = require('./routes/index');
const cors = require('cors');
app.use(cors());
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
app.use(express.json());

const app = express();

app.use('/api/v1',mainRouter);

app.listen(3000,()=>{
    console.log(`server started at port 3000`)
})