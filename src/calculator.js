#!/usr/bin/env node
/**
 * Node.js CLI Calculator
 *
 * Supported operations:
 *  - add       : addition (sum of all provided numbers)
 *  - subtract  : subtraction (left-associative: a - b - c ...)
 *  - multiply  : multiplication (product of all provided numbers)
 *  - divide    : division (left-associative: a / b / c ...; checks division by zero)
 *
 * Usage examples:
 *   node src/calculator.js add 2 3        # 5
 *   node src/calculator.js subtract 10 4 # 6
 *   node src/calculator.js multiply 3 4  # 12
 *   node src/calculator.js divide 12 3   # 4
 *
 * Also supports a short infix form: node src/calculator.js 2 + 3
 */

function exitError(msg) {
  console.error('Error:', msg);
  process.exitCode = 1;
}

function parseNums(strs) {
  const nums = strs.map(s => {
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  });
  if (nums.some(n => Number.isNaN(n))) return null;
  return nums;
}

function compute(op, nums) {
  if (nums.length < 2) {
    exitError('At least two numeric arguments are required.');
    return null;
  }
  switch (op) {
    case 'add':
    case '+':
      return nums.reduce((a, b) => a + b, 0);
    case 'subtract':
    case 'sub':
    case '-':
      return nums.reduce((a, b) => a - b);
    case 'multiply':
    case 'mul':
    case '*':
    case 'x':
      return nums.reduce((a, b) => a * b, 1);
    case 'divide':
    case 'div':
    case '/':
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] === 0) {
          exitError('Division by zero is not allowed.');
          return null;
        }
      }
      return nums.reduce((a, b) => a / b);
    default:
      exitError(`Unknown operation: ${op}`);
      return null;
  }
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    console.log('Usage: node src/calculator.js <operation> <num1> <num2> [num3 ...]');
    console.log('Operations: add, subtract, multiply, divide (also support + - * /)');
    process.exit(0);
  }

  let op;
  let numArgs;

  // Support two forms:
  // 1) word form: add 2 3  -> op = add, nums = [2,3]
  // 2) infix form: 2 + 3  -> op = +, nums = [2,3]
  if (argv.length >= 3 && isNaN(Number(argv[0]))) {
    // word form: operation then numbers
    op = argv[0].toLowerCase();
    numArgs = argv.slice(1);
  } else if (argv.length === 3 && !isNaN(Number(argv[0])) && isNaN(Number(argv[1])) && !isNaN(Number(argv[2]))) {
    // infix: num op num
    op = argv[1];
    numArgs = [argv[0], argv[2]];
  } else if (argv.length >= 2 && !isNaN(Number(argv[0])) && argv.length >= 3 && isNaN(Number(argv[1]))) {
    // handle: 10 - 2 3  (treat as left-assoc: 10 - 2 - 3)
    op = argv[1];
    numArgs = [argv[0], ...argv.slice(2)];
  } else {
    // fallback: assume first is op
    op = argv[0].toLowerCase();
    numArgs = argv.slice(1);
  }

  const nums = parseNums(numArgs);
  if (!nums) {
    exitError('One or more arguments are not valid numbers.');
    process.exit(1);
  }

  const result = compute(op, nums);
  if (result === null) process.exit(1);

  // Output result (plain number)
  console.log(result);
}

// Export functions for testing
module.exports = { compute, parseNums, exitError };
