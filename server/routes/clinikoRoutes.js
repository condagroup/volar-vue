const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/clinikoRevenue', async (req, res) => {
  try {
    const response = await axios.get('https://api.cliniko.com/v1/payments', {
      headers: {
        'Authorization': `Bearer ${process.env.CLINIKO_API_KEY}`,
        'User-Agent': 'AppName (your_email@example.com)',
        'Accept': 'application/json',
      },
    });

    const revenueData = response.data.payments;
    res.send(revenueData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching revenue data');
  }
});

module.exports = router;