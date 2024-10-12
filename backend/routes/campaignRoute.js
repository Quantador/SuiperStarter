import express from 'express';


const router = express.Router();

//create a new campaign
router.post('/campaign', (req, res) => {});

// //change the target of a campaign
// router.put('/campaign/:id/target', (req, res) => {});

//Add a donation to a campaign
router.post('/campaign/:id/donate', (req, res) => {});

//Get all campaigns
router.get('/campaign', (req, res) => {});

//Get a campaign by id
router.get('/campaign/:id', (req, res) => {});

// //Get all donations for a campaign
// router.get('/campaign/:id/donations', (req, res) => {});

// //Get all donations by a specific donor
// router.get('/donations/:donorId', (req, res) => {});

