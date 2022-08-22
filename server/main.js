const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.urlencoded({extended:false}));

app.post('/tracker',(req,res)=>{
  console.log(req.body);
  res.send(200,'backend has received')
})

app.listen(9000,()=>{
  console.log('listening port 9000');
})