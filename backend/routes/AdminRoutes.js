const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken')
const AdminModel = require('../models/schemas/AdminSchema');
const TourModel = require('../models/schemas/TourSchema');
const GuideModel = require('../models/schemas/GuideSchema');
const TravellerModel = require('../models/schemas/TravellerSchema');
const UserModel = require('../models/schemas/UserSchema');
const bcrypt = require('bcryptjs');
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    JWT.verify(token, 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        AdminModel.findOne({ username: user.username }).then((result) => {
            if (!result) {
                return res.sendStatus(401);
            }
            next();
        }).catch((err) => {
            console.error(err);
            return res.sendStatus(500);
        });
    });
}
router.get('/tours', authenticateToken, (req, res) => {
    //sending all tours
    TourModel.find({}).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

router.get('/tour/:id', authenticateToken, (req, res) => {
    //sending respective tour
    TourModel.find({ tour_id: req.params.id }).then((result) => {
        if (result.length === 0) {
            return res.sendStatus(404);
        }
        res.status(200).json(result);
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

router.post('/tour', authenticateToken, (req, res) => {
    //adding new tour
    TourModel.create({
        tour_id: req.body.tour_id,
        details: req.body.details
        // {
        // tour_name: req.body.tour_name,
        // guide_id: req.body.guide_id,
        // start_date: req.body.start_date,
        // end_date: req.body.end_date,
        // location: req.body.location,
        // price: req.body.price,
        // description: req.body.description,
        // slots: req.body.slots
        // }
    }).then((result) => {
        res.status(201).json("Tour added successfully");
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

router.put('/tour/:id', authenticateToken, (req, res) => {
    //updating the tour
    TourModel.updateOne({ tour_id: req.params.id }, {
        tour_id: req.body.tour_id,
        details: req.body.details
    }).then((result) => {
        res.status(202).json("updated tour details");
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

router.delete('/tour/:id', authenticateToken, (req, res) => {
    //deleting the tour
    TourModel.deleteOne({ tour_id: req.params.id }).then((result) => {
        res.status(202).json("Tour deleted successfully");
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})



router.get('/guides', authenticateToken, (req, res) => {
    //sending all guides
    GuideModel.find({}, { password: 0 }).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

router.post('/guide', authenticateToken, (req, res) => {
    //add guide
    const { username, email, password, tours, guide_id } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        GuideModel.create({ guide_id: guide_id, username: username, email: email, password: hash, tours: tours }).then((result) => {
            res.status(201).json("Guide added successfully");
        }).catch((err) => {
            console.error(err);
            return res.sendStatus(500);
        });
    });
})

router.delete('/guide/:id', authenticateToken, (req, res) => {
    //delete guide
    GuideModel.deleteOne({ guide_id: req.params.id }).then((result) => {
        res.status(202).json("Guide deleted successfully");
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

router.put('/guide/:id', authenticateToken, (req, res) => {
    //update guide details
    GuideModel.updateOne({ guide_id: req.params.id }, {
        guide_id: req.body.guide_id,
        username: req.body.username,
        email: req.body.email,
        // password:bcrypt.hash(req.body.password,10),
        tours: req.body.tours
    }).then((result) => {
        res.status(202).json("Guide updated successfully");
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

router.get('/traveller', authenticateToken, (req, res) => {
    //send all customers who booked slot
    TravellerModel.find({}).then((err, result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
});

router.put('/traveller/:id', authenticateToken, (req, res) => {
    //updating the customer
    TravellerModel.updateOne({ tour_id: req.body.tour_id, username: req.params.id }, {
        username: req.body.username,
        count: req.body.count,
        phone: req.body.phone,
        tour_id: req.body.tour_id,
        email: req.body.email
    }).then((result) => {
        res.status(202).json("Traveller updated successfully");
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

router.delete('/traveller/:id', authenticateToken, (req, res) => {
    //deleting the customer
    TravellerModel.deleteOne({ username: req.params.id, tour_id: req.body.tour_id }).then((result) => {
        res.status(202).json("Traveller deleted successfully");
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

router.post('/traveller', authenticateToken, (req, res) => {
    //adding the customer
    TravellerModel.create({
        username: req.body.username,
        count: req.body.count,
        phone: req.body.phone,
        tour_id: req.body.tour_id,
        email: req.body.email
    }).then((result) => {
        res.status(201).json("Traveller added successfully");
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

router.post('/coadmin', authenticateToken, (req, res) => {
    //adding other admins
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        AdminModel.create({ username: username, email: email, password: hash }).then((result) => {
            res.status(201).json("Admin added successfully");
        }).catch((err) => {
            console.error(err);
            return res.sendStatus(500);
        });
    });
})

router.get('/coadmins', authenticateToken, (req, res) => {
    //sending all admins
    AdminModel.find({
        $nor: [
            { username: "admin", email: "Admin@gmail.com" }
        ]
    }).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

router.put('/coadmin/:id', authenticateToken, (req, res) => {
    //updating co-admin
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        AdminModel.updateOne({ username: req.params.id }, {
            username: username,
            email: email,
            password: hash
        }).then((result) => {
            res.status(202).json("Admin updated successfully");
        }).catch((err) => {
            console.error(err);
            return res.sendStatus(500);
        });
    })
});

router.delete('/coadmin/:id', authenticateToken, (req, res) => {
    //deleting co-admin
    AdminModel.deleteOne({ username: req.params.id }).then((result) => {
        if (req.params.id === "admin") {
            return res.sendStatus(401);//admin cannot be deleted
        }
        res.status(202).json("Admin deleted successfully");
    }).catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
})

module.exports = router;