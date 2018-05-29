const express = require('express')
const bodyParser = require('body-parser');
const app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wedding_dev',function (err) {
   if (err) throw err;
   console.log('Successfully connected to DB');
});
var Schema = mongoose.Schema;
var guestReservation = new Schema({
	guestPartyId:String,
	guestList: [{
		firstName:String,
		lastName:String
	}],
	plusOne: Boolean
})
var guestReservationModel=mongoose.model('guestReservation', guestReservation,'guestList');

var guestResponse = new Schema({
	guestPartyId: String,
	attending: Boolean,
	massAttending: Boolean,
	gatheringAttending: Boolean,
	plusOneName: String
})
var guestResponseModel=mongoose.model('guestResponse', guestResponse,'guestResponse');

var guestMadLibResponse = new Schema({
	guestPartyId: String,
	madLib1: String,
	madLib2: String,
	madLib3: String,
	madLib4: String,
	madLib5: String,
	madLib6: String,
	madLibArtist: String,
	madLibSong: String
})
var guestMadLibResponseModel=mongoose.model('guestMadLibResponse', guestMadLibResponse,'guestMadLibResponse');

app.use(bodyParser.urlencoded({extended: true}));
app.get('/',(req, res) => res.sendFile('index.html',{root:__dirname+"/app"}));

//GET /rsvp
//returns 404s
app.post('/rsvp',(req,res)=> {
	let rsvpNameSearch=req.body,
		firstName=rsvpNameSearch.firstName,
		lastName=rsvpNameSearch.lastName;
	if(firstName && lastName){
		guestReservationModel.findOne({'guestList.firstName':firstName,'guestList.lastName':lastName}).exec(function(err, docs){
			console.log(docs);
			if (err){
				res.sendStatus(400);
			}else{
				if(docs==null){
					res.sendStatus(404);
				}else{
					docs.guestPartyId=docs._id;
					delete docs._id;
					console.log(docs)
					res.json(docs);
				}
			}
		})
	}else{
		res.sendStatus(404);
	}
});
app.post('/rsvp/response', (req, res)=>{
	let rsvpResponse = req.body;
	if(rsvpResponse){
		var response = new guestResponseModel(req.body).find({'guestPartyId':rsvpResponse.guestPartyId});
		response.save();
		res.json({
			'guestPartyId':response.guestPartyId
		});
	
	}
});
	
app.post('/rsvp/madlib', (req, res)=>{
	let rsvpResponse = req.body;
	if(rsvpResponse){
		var response = new guestMadLibResponseModel(req.body);
		response.save();
		res.sendStatus(204);
	}
});

app.use(express.static('app'));
app.listen(3000, () => console.log('Listening on port 3000'));