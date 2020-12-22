const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config(); 
//dotenv loads .env file variables to be able to use them in the project as global variables

const app = express()

//DataBase
mongoose.connect(process.env.DATABASE_CLOUD, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => console.log('DB connected!'))
.catch(err => console.log(err));

//fixed DeprecationWarning in server console:
// mongoose.set('useCreateIndex', true);

//import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');

//app middlewars
app.use(morgan('dev')); {/*prints to console the API requests time*/}
app.use(bodyParser.json());
//app.use(cors());	{/*cors method determines which domain is able to send us requests*/}
app.use(cors({origin: process.env.CLIENT_URL}));

//middlewares, we move the logic to seperate route for each request starting with /api
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);

{/*process is the high level object where node process will be run*/}
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`API is running on port ${port}`));