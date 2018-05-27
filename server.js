const express = require('express')
const bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.urlencoded({extended: true}));

app.get('/',(req, res) => res.sendFile('index.html',{root:__dirname+"/app"}));

//GET /rsvp
//returns 404s
app.post('/rsvp',(req,res)=> {
	let rsvpNameSearch=req.body,
		firstName=rsvpNameSearch.firstName,
		lastName=rsvpNameSearch.lastName;
	if(firstName && lastName){
		res.json({
			'guestPartyId':'1234',
			'guestList':[
				{
					'firstName':'FirstName Guest1',
					'lastName':'LastName Guest1'
				},
				{
					'firstName':'FirstName Guest2',
					'lastName':'LastName Guest2'
				},
				{
					'firstName':'FirstName Guest3',
					'lastName':'LastName Guest3'
				},
				{
					'firstName':'FirstName Guest4',
					'lastName':'LastName Guest4'
				},
			],
			'plusOne':true
		});
	}
	res.sendStatus(404);
});
app.post('/rsvp/response', (req, res)=>{
	let rsvpResponse = req.body;
	console.log(rsvpResponse);
	res.json({
			'guestPartyId':'1234'
	});
});
app.post('/rsvp/madlib', (req, res)=>{
	let rsvpResponse = req.body;
	console.log(rsvpResponse);
	res.sendStatus(204);
});

app.use(express.static('app'));
app.listen(3000, () => console.log('listening'));
	   
