const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose');
var db, hostFolder,port;
const session = require('express-session');

if(process.argv){
	let environment=process.argv[2];
	console.log(environment);
	if(environment=="dev"){
	    db='wedding_dev';
	    hostFolder="app";
	    port=3000;
	    
	}
	else if(environment=="production"){
		db='wedding';
	    hostFolder="dist";
	    port=3002;
	}
}
console.log('using database'+db+' and folder:' +hostFolder);
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
	dietary: String,
	dietOther: String,
	massAttending: Boolean,
	gatheringAttending: Boolean,
	plusOneResponse: Boolean,
	plusOneName: String,
	timestamp: Date,
	song:String,
	artist:String
})
var guestResponseModel=mongoose.model('guestResponse', guestResponse,'guestResponse');

var guestMadLibResponse = new Schema({
	guestPartyId: String,
	madLib1: String,
	madLib2: String,
	madLib3: String,
	madLib4: String,
	madLib5: String,
	madLib6: String
})
var guestMadLibResponseModel=mongoose.model('guestMadLibResponse', guestMadLibResponse,'guestMadLibResponse');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
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
			if (err){
				res.sendStatus(400);
			}else{
				if(docs==null){
					res.sendStatus(404);
				}else{
					docs.guestPartyId=docs._id;
					docs._id=undefined;
					res.json(docs);
				}
			}
		})
	}else{o
		res.sendStatus(404);
	}
});
app.post('/rsvp/response', (req, res)=>{
	let rsvpResponse = req.body;
	if(rsvpResponse){
		rsvpResponse.timestamp=new Date();
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

app.use(session({
	key:'user_sid',
	secret: 'abcd',
	resave:false,
	saveUninitialized:false,
	cookie:{
		expires: 60000
	}
}));

app.use((req,res,next)=>{
	if(req.cookies.user_sid && !req.session.user){
		res.clearCookie('user_sid');
	}
	next();
});

var sessionChecker = (req, res, next)=> {
	if(req.session.user && req.cookies.user_sid){
		res.redirect('/admin');
	}else{
		next();
	}
};

app.route('/login').get(sessionChecker, (req, res)=>{
	res.sendFile('login.html',{root:__dirname+"/"+hostFolder})
}).post((req,res)=>{
	var username = req.body.username,
	password = req.body.password;
	console.log(username, password);
	req.session.user={user:username};
	res.redirect('/admin');
});

app.get('/admin', (req, res) => {
	console.log(req.session.user)
	console.log(req.cookies.user_sid);
	if(req.session.user && req.cookies.user_sid){
		res.sendFile('admin.html',{root:__dirname+"/"+hostFolder})
	}else{
		res.redirect('/login');
	}
});

app.get('/logout', (req,res)=>{
	if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
})

app.post('/admin/guestList',sessionChecker,(req,res)=>{
	let guestReservationMap = {};
	guestReservationModel.find({},function(err,guestReservationList){
		for(let guestReservation of guestReservationList){
			let guestReservationId = guestReservation['_id'];
			console.log(guestReservationId);
			if(guestReservationMap[guestReservationId]==undefined){
				guestReservationMap[guestReservationId]={
					guestList:guestReservation.guestList
				}
			}
		}		
		guestResponseModel.find({},function(err, guestResponseList){
			for(let guestResponse of guestResponseList){
				let temp=guestReservationMap[guestResponse.guestPartyId];
				if(temp){
					delete temp.guestPartyId;
					delete temp['_id'];
					Object.assign(temp,guestResponse.toObject());
				}
			}
			res.json(guestReservationMap);
		})
	});
})
app.listen(port, () => console.log('Listening on port '+port));
