const express=require('express')
const router = express.Router()
const JWT = require("jsonwebtoken");
const UserModel = require('../models/schemas/UserSchema');
const TravellerModel = require('../models/schemas/TravellerSchema');
const TourModel = require('../models/schemas/TourSchema');
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    JWT.verify(token, 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        UserModel.findOne({username:user.username}).then((result)=>{
            if(result.length === 0){
                return res.sendStatus(401);
            }
            next();
        }).catch((err)=>{
            console.error(err);
            return res.sendStatus(500);
        });
    });
}

router.get('/tours/popular',(req,res)=>{
    //sending popular tours
    TourModel.find({}).sort({'details.rating':-1}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
});

router.get('/tours/highlyrecommended',(req,res)=>{
    //sending expensive tours
    TourModel.find({}).sort({'details.cost':-1}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
});

router.get('/tours',(req,res)=>{
    //sending all tours
    TourModel.find({}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
})

router.get('/tour/:id',(req,res)=>{
    //sending respective tour
    TourModel.find({tour_id:req.params.id}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
})

router.post('/tour/:id',authenticateToken,(req,res)=>{
    //adding commited tour
    TravellerModel.create({
        tour_id: req.body.tour_id,
        count: req.body.count,
        phone: req.body.phone,
        email: req.body.email,
        username: req.body.username
    }).then((result)=>{
        res.status(201).json();
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
})

router.get('/bookedtours',authenticateToken,(req,res)=>{
    //sending all booked 
    const username = req.body.username;
    TravellerModel.find({username:username}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
})

module.exports = router;