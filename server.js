const express = require('express')
const app = express()

app.get('/',(req, res) => res.sendFile('index.html',{root:__dirname+"/app"}));

app.post('/rsvp',(req,res)=> console.log(req));
app.use(express.static('app'));
app.listen(3000, () => console.log('listening'));
	   
