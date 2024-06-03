const express = require("express");
const expressError = require("./expressError");
const app = express();

//calculator functions
function calculateMean(numsArr) {
    const total = numsArr.reduce((acc,num)=> acc + num,0);
    return total / numsArr.length;
}

function calculateMedian(numsArr) {
    numsArr.sort((a,b)=> a-b);
    const mid = Math.floor(numsArr.length / 2);

    if(numsArr.length % 2 === 0) {
        return (numsArr[mid-1]+numsArr[mid])/2
    } else {
        return numsArr[mid];
    }
}

function calculateMode(numsArr) {
    const frequency = {};
    let max = 0;
    let mode;
    numsArr.forEach((num)=>{
        if(frequency[num]){
            frequency[num] ++;
        } else {
            frequency[num] = 1;
        }
    })

    Object.keys(frequency).forEach((key) => {
        if (frequency[key] > max) {
            max = frequency[key];
            mode = Number(key);
        }
    });
        
    return mode;
}




//app routes
app.get("/mean", function(request,response,next){
    try {
        let {nums} = request.query; 
        if(!nums) {
            next(new expressError("Numbers are required", 400));
        }
        let arrayOfNums = nums.split(",").map((num)=>{
            let parsedNum = parseInt(num);
            if(isNaN(parsedNum)) {
                next(new expressError(`Invalid: ${num} is not a number`, 400));
            }
            return parsedNum; //this will return the parsed num value and insert into the arrayOfNums array.
        })
        let mean =calculateMean(arrayOfNums);

        response.json({
            operation: "mean",
            value: mean
        });

    } catch(error){
        next(error);
    }
})

app.get("/median",(request,response,next) => {
    try {
        let {nums} = request.query; 
        if(!nums) {
            next(new expressError("Numbers are required", 400));
        }
        let arrayOfNums = nums.split(",").map((num)=>{
            let parsedNum = parseInt(num);
            if(isNaN(parsedNum)) {
                next(new expressError(`Invalid: ${num} is not a number`, 400));
            }
            return parsedNum; //this will return the parsed num value and insert into the arrayOfNums array.
        })
        let median =calculateMedian(arrayOfNums);

        response.json({
            operation: "median",
            value: median
        });

    } catch(error){
        next(error);
    }
});

app.get("/mode",(request,response,next) => {
    try {
        let {nums} = request.query; 
        if(!nums) {
            next(new expressError("Numbers are required", 400));
        }
        let arrayOfNums = nums.split(",").map((num)=>{
            let parsedNum = parseInt(num);
            if(isNaN(parsedNum)) {
                next(new expressError(`Invalid: ${num} is not a number`, 400));
            }
            return parsedNum; //this will return the parsed num value and insert into the arrayOfNums array.
        })
        let mode =calculateMode(arrayOfNums);

        response.json({
            operation: "mode",
            value: mode
        });

    } catch(error){
        next(error);
    }
});

app.use((error, req, res, next) => {
    res.status(error.status).json({
        error: error.message,
        status: error.status
    })
});




app.listen(1000, () => {
    console.log("Calc is on port 1000");
});