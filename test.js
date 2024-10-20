const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 5000;

const cors = require('cors');
app.use(cors());

app.get('/api/menu', async (req, res) => {
  try {
    const { location, date, period} = req.query;

   
    console.log(req.query)
    const response = await axios.get(`https://virginia.campusdish.com/api/menu/GetMenus?locationId=${location}&storeIds=&mode=Daily&date=${date}&time=&periodId=${period}&fulfillmentMethod=`);

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from the external API');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});