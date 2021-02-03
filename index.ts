import cors from 'cors';
import express from 'express';
import * as dotenv from "dotenv";
import mongoose from 'mongoose';
import helmet from "helmet";


dotenv.config();

if (!process.env.PORT) {
  console.log(`Error to get ports`);
    process.exit(1);
 }

 const PORT: number = parseInt(process.env.PORT as string, 10);
 
 const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", 'https://mohammadzaidhussain.github.io/*');
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   let header = req.headers["origin"] as string
//   if(header == 'https://mohammadzaidhussain.github.io/*' && !req.headers['postman-token']) {
//     next()
//   }
//   else{
//     res.status(404).json('Page not found')
//   }
// });

app.use(function(err, req, res, next) {
  if(err)
  return res.status(500).send('Syntax error' + err);
  else next()
});

let router = require("./src/router/router")
app.use('/registration', router)

mongoose.connect(process.env.DATABASE_URL || 'mongodb+srv://zaid21:Jam@0813@zaihamm21.bg9yp.mongodb.net/<dbname>?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (err) => {
  if(err) {
    throw err
  }
}).catch((err) => {
  console.log(err)
})
export const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

const server = app.listen(PORT || 8000, () => {
    console.log(`Listening on port ${PORT}`);
});

//Send message for default URL
app.get('/', (req, res) => res.send('Server up and running'));