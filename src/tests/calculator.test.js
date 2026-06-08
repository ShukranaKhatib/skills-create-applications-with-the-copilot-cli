const { compute, parseNums } = require('../calculator');

describe('Calculator core functions', () => {
  test('addition: 2 + 3 = 5 (infix style)', () => {
    const nums = parseNums(['2', '3']);
    expect(nums).not.toBeNull();
    const res = compute('+', nums);
    expect(res).toBe(5);
  });

  test('addition: add 2 3 4 => 9 (multi-arg)', () => {
    const nums = parseNums(['2', '3', '4']);
    expect(compute('add', nums)).toBe(9);
  });

  test('subtraction: 10 - 4 = 6', () => {
    const nums = parseNums(['10', '4']);
    expect(compute('-', nums)).toBe(6);
  });

  test('subtraction: subtract 20 3 2 => 15 (left-associative)', () => {
    const nums = parseNums(['20', '3', '2']);
    expect(compute('subtract', nums)).toBe(15);
  });

  test('multiplication: 45 * 2 = 90', () => {
    const nums = parseNums(['45', '2']);
    expect(compute('*', nums)).toBe(90);
  });

  test('multiplication: multiply 2 3 4 => 24', () => {
    const nums = parseNums(['2', '3', '4']);
    expect(compute('multiply', nums)).toBe(24);
  });

  test('division: 20 / 5 = 4', () => {
    const nums = parseNums(['20', '5']);
    expect(compute('/', nums)).toBe(4);
  });

  test('division: divide 100 2 5 => 10 (left-associative)', () => {
    const nums = parseNums(['100', '2', '5']);
    expect(compute('divide', nums)).toBe(10);
  });

  test('division by zero returns null and sets exit code (a / 0)', () => {
    const nums = parseNums(['10', '0']);
    const res = compute('/', nums);
    expect(res).toBeNull();
  });

  test('invalid numeric inputs produce parseNums null', () => {
    expect(parseNums(['2', 'foo'])).toBeNull();
  });

  test('unknown operation returns null', () => {
    const nums = parseNums(['2', '3']);
    expect(compute('unknown-op', nums)).toBeNull();
  });

  test('requires at least two args', () => {
    const nums = parseNums(['5']);
    // compute will call exitError and return null
    expect(compute('add', nums)).toBeNull();
  });

  // Extended operations tests (modulo, power, square root)
  test('modulo: 5 % 2 = 1', () => {
    const nums = parseNums(['5', '2']);
    expect(compute('%', nums)).toBe(1);
    expect(compute('mod', nums)).toBe(1);
  });

  test('power: 2 ^ 3 = 8 (aliases ** and pow)', () => {
    const nums = parseNums(['2', '3']);
    expect(compute('^', nums)).toBe(8);
    expect(compute('**', nums)).toBe(8);
    expect(compute('pow', nums)).toBe(8);
  });

  test('square root: sqrt 16 = 4 (single-arg)', () => {
    const nums = parseNums(['16']);
    expect(compute('sqrt', nums)).toBe(4);
  });

  test('modulo by zero returns null', () => {
    const nums = parseNums(['10', '0']);
    expect(compute('mod', nums)).toBeNull();
  });

  test('square root of negative number returns null', () => {
    const nums = parseNums(['-9']);
    expect(compute('sqrt', nums)).toBeNull();
  });
});
