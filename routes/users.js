var express = require('express');
var router = express.Router();
/*
let users = [
  {id: Date.now(), izena: "John", abizena: "Doe", email: "john@doe.com"},
];
*/
//nik gehituta 
var router=express.Router();

const mongojs=require('mongojs')
const bezeroakdb = mongojs('localhost:27017/bezeroakdb');
const db = mongojs(bezeroakdb, ['bezeroak'])

let users=[]
db.bezeroak.find(function(err,userdocs){
  if(err){
    console.log(err)
  }else{
    users=userdocs
  }
})


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("users", {
    title: "Users", 
    users: users
  });
});

router.get('/list', function(req, res, next) {
  res.json(users)
  });


router.post("/new", (req, res) => {
  users.push(req.body);
  db.bezeroak.insert(req.body, function(err,user){
    if(err){
      console.log(err)
    }else{
      console.log(user)
      res.json(user);
    }
  })
});

router.delete("/delete/:id", (req, res) => {
  users = users.filter(user => user.id != req.params.id);
  //remove user form mongo
  db.bezeroak.remove({_id: mongojs.ObjectId(req.params.id)} ,
  function(err,user){
    if(err){
      console.log(err)
    }else{
      console.log(user)
    }
  })
  res.json(users);
});

router.put("/update/:id", (req, res) => {
  let user = users.find(user => user.id == req.params.id);
  user.izena = req.body.izena;
  user.abizena = req.body.abizena;
  user.email = req.body.email;
  //updateuser in mongo
  db.bezeroak.update({_id: mongojs.ObjectId(req.params.id)},
    {$set: {izena: req.body.izena, abizena: req.body.abizena,email:req.body.email} },
    function (err,user) {
      if(err){
        console.log(err)
      } else {
        console.log(user)
      }
    })
  res.json(users);
})

module.exports = router;
