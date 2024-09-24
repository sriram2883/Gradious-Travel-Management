const express=require('express')
const router = express.Router()
const JWT = require('jsonwebtoken')
const TravellerModel = require('../models/schemas/TravellerSchema')
const GuideModel = require('../models/schemas/GuideSchema')
const TourModel = require('../models/schemas/TourSchema')
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    JWT.verify(token, 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        GuideModel.findOne({username:user.username}).then((result)=>{
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

router.get('/travellers',authenticateToken,(req,res)=>{
    //sending travellers details
    var tour_id;
    GuideModel.find({username:req.body.username}).then((result)=>{
        tour_id = result[0].tours.assigned_tours[0];
        TravellerModel.find({tour_id:tour_id}).then((result)=>{
            res.status(200).json(result);
        }).catch((err)=>{
            console.error(err);
            return res.sendStatus(500);
        });
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
})

router.get('/tour',authenticateToken,(req,res)=>{
    //sending tour schedule
    var tour_id;
    GuideModel.find({username:req.body.username}).then((result)=>{
        tour_id = result[0].tours.assigned_tours[0];
        TourModel.find({tour_id:tour_id}).then((result)=>{
            res.status(200).json(result);
        }).catch((err)=>{
            console.error(err);
            return res.sendStatus(500);
        });
    }).catch((err)=>{
        console.error(err);
        return res.sendStatus(500);
    });
    
})

module.exports = router;