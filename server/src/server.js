const { json } = require("express");
const express = require("express");
const admin = require('./config/firebase-config');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.post('/send', (req, res) => {
   
    const data = req.body; 
    console.log(data)
    admin.messaging().send({
      token: data.token,      
      notification: {
        title: data.title,
        body: data.body
      }
    })
    return res.json(123)
});
app.get('/test', (req, res) => {
  return res.json({123: 123})
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})