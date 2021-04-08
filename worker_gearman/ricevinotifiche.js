const gearman = require('gearman')

 // Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")

// Initialize express and define a port
const app = express()
const PORT = 8181
global.resultPayload = ""
let client = gearman("localhost", 4730 , {timeout: 3000})  // timeout in milliseconds. 
 
//GERMAN
// handle timeout 
client.on('timeout', function() {
    //console.log('Timeout occurred')
    client.close()
})
 
 
// handle finished jobs
client.on('WORK_COMPLETE', function(job) {   
    console.log('job completed, result:', job.payload.toString())
    global.resultPayload = job.payload.toString()
    client.close()
})
 
// connect to the gearman server
client.connect(function() {
    // submit a job to encode base64 a string with normal priority in the foreground
    client.submitJob('base64', 'Hello, World!')
})

//NODE
app.use(bodyParser.json())

app.post("/notification", (req, res) => { 
    var data = ""
    for(var key in req.body) {
        if(req.body.hasOwnProperty(key)){
          data = req.body[key]
          break;
        }
    }
    //string in base64 with worker gearman
    client.connect(function() {       
        // submit a job to encode in base64 a string with normal priority in the foreground
        client.submitJob('base64', data.toString())
    })   
    res.json({message : global.resultPayload})
    console.log("req.body: " + data.toString()) 
})

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))