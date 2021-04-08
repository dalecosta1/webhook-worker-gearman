const gearman = require('gearman')
 
let worker = gearman('127.0.0.1', 4730)
 
// handle jobs assigned by the server
worker.on('JOB_ASSIGN', function(job) {
    console.log(job.func_name + ' job assigned to this worker')
    let result = job.payload.toString('base64')
    // notify the server the job is done
    worker.sendWorkComplete(job.handle, result)
 
    // go back to sleep, telling the server we're ready for more work
    worker.preSleep()
});
 
// grab a job when the server signals one is available
worker.on('NOOP', function() {  worker.grabJob() })
 
// connect to the gearman server	
worker.connect(function(){
    // register the functions this worker is capable of
    worker.addFunction('base64')
 
    // tell the server the worker is going to sleep, waiting for work
    worker.preSleep()
});