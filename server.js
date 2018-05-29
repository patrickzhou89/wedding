const express = require('express')
const bodyParser = require('body-parser');
const app = express();
var mongoose = require('mongoose');
var db, hostFolder;
console.log(process.argv)
if(process.argv){
	let environment=process.argv[2];
	console.log(environment);
	if(environment=="dev"){
		db='wedding_dev';
		hostFolder="app";
	}
	else if(environment=="production"){
		db='wedding';
		hostFolder="dist";
	}
}
	console.log(db, hostFolder);
mongoose.connect('mongodb://localhost/'+db,function (err) {
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
	plusOneResponse: Boolean,
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
app.use(express.static(hostFolder));
app.get('/',(req, res) => res.sendFile('index.html',{root:__dirname+"/"+hostFolder}));

//GET /rsvp
//returns 404s
app.post('/rsvp',(req,res)=> {
	let rsvpNameSearch=req.body,
		firstName=rsvpNameSearch.firstName,
		lastName=rsvpNameSearch.lastName;
	if(firstName && lastName){
		guestReservationModel.findOne({'guestList.firstName':{'$regex':firstName,$options:'i'},'guestList.lastName':{'$regex':lastName,$options:'i'}}).exec(function(err, docs){
			console.log(docs);
			if (err){
				res.sendStatus(400);
			}else{
				if(docs==null){
					res.sendStatus(404);
				}else{
					docs.guestPartyId=docs._id;
					docs._id=undefined;
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
		guestResponseModel.findOneAndUpdate({'guestPartyId':rsvpResponse.guestPartyId},rsvpResponse,{upsert:true, new:true, runValidators:true}).exec(function(err, docs){
			if(err){
				console.log(err);
				res.sendStatus(400)
			}else{
				res.json({
					'guestPartyId':rsvpResponse.guestPartyId,
					'attending':rsvpResponse.attending
				})
			}
		});
	}
});
	
app.post('/rsvp/madlib', (req, res)=>{
	let rsvpResponse = req.body;
	if(rsvpResponse){
		guestMadLibResponseModel.findOneAndUpdate({'guestPartyId':rsvpResponse.guestPartyId},rsvpResponse,{upsert:true, new:true, runValidators:true}).exec(function(err, docs){
			if(err){
				console.log(err);
				res.sendStatus(400)
			}else{
				res.sendStatus(204);
			}
		});
	}
});

app.listen(3000, () => console.log('Listening on port 3000'));