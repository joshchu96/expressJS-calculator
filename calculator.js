const express = require('express');
const expressError = require('./expressError');
const app = express();

//Mean,Median,Mode functions
function calculateMean(numbers) {
  const total = numbers.reduce((acc, num) => acc + num, 0);
  return total / numbers.length;
}

function calculateMedian(numbers) {
  numbers.sort((a, b) => a - b);
  const mid = Math.floor(numbers.length / 2);

  return numbers.length % 2 === 0
    ? (numbers[mid - 1] + numbers[mid]) / 2
    : numbers[mid];
}

function calculateMode(numbers) {
  const frequency = {};
  let maxFreq = 0;
  let modes = [];

  numbers.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
    }
  });

  for (let num in frequency) {
    if (frequency[num] === maxFreq) {
      modes.push(Number(num));
    }
  }

  return modes;
}

function parseNumbers(req, res, next) {
  try {
    const { nums } = req.query;
    if (!nums) {
      throw new expressError('Numbers are required', 400);
    }
    const numbers = nums.split(',').map(num => {
      const parsedNum = parseFloat(num);
      if (isNaN(parsedNum)) {
        throw new expressError(`Invalid number: ${num}`, 400);
      }
      return parsedNum;
    });
    req.numbers = numbers;
    next();
  } catch (err) {
    next(err);
  }
}

// Route to calculate the mean
app.get('/mean', parseNumbers, (req, res, next) => {
  const mean = calculateMean(req.numbers);
  res.json({ operation: 'mean', value: mean });
});

// Route to calculate the median
app.get('/median', parseNumbers, (req, res, next) => {
  const median = calculateMedian(req.numbers);
  res.json({ operation: 'median', value: median });
});

// Route to calculate the mode
app.get('/mode', parseNumbers, (req, res, next) => {
  const mode = calculateMode(req.numbers);
  res.json({ operation: 'mode', value: mode });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Default route for handling undefined routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the server
app.listen(2000, () => {
  console.log("Calculator is listening on port 2000");
});
