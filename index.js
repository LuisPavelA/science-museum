const fs = require('fs')
const cors = require("cors")
const bodyparser = require('body-parser');
const stream = require('stream')
const config = require("./config.json")
const compression = require('compression')

// Express Setup
const express = require('express');
const app = express();

app.use(compression())
app.set("view engine", "ejs")
app.use(cors())
app.use(bodyparser.json())


app.get('/uptime',(req, res) => {
  res.sendStatus(200)
})


// UI Routes
app.get('/', (req, res) => {
  let file_names = fs.readdirSync(config.icons_path)
  let file_sizes = []

  
  res.render("main", {
    directory: "/",
    names: file_names,
    sizes: file_sizes,
    website: config.website_address,
    owner: config.owner
  })
})

// API

app.get('/icons/:directory',(req, res) => {
  if (fs.existsSync(`${config.icons_path}${req.params.directory}`)) {
    const r = fs.createReadStream(`${config.icons_path}${req.params.directory}`)
    const ps = new stream.PassThrough()
    stream.pipeline(
      r,
      ps,
      (err) => {
        if (err) {
          console.log(err)
          return res.sendStatus(400); 
        }
      }
    )
    ps.pipe(res)
    
    res.flush()
  } else {
    res.status(404)
    res.send("The file was not found")
  }
})

app.get('/:directory',(req, res) => {
  if (fs.existsSync(`${config.images_path}${req.params.directory}`)) {
    const r = fs.createReadStream(`${config.images_path}${req.params.directory}`)
    const ps = new stream.PassThrough()
    stream.pipeline(
      r,
      ps,
      (err) => {
        if (err) {
          console.log(err)
          return res.sendStatus(400); 
        }
      }
    )
    ps.pipe(res)
    
    res.flush()
  } else {
    res.status(404)
    res.send("The file was not found")
  }
})

// Start up server
app.listen(3000, () => {
  console.log('Image Server is up and running!');
});