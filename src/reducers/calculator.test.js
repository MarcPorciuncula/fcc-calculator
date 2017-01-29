import test from 'ava';

import calculator, {
  INPUT_DIGIT,
  CLEAR_DISPLAY,
  RESET,
  SET,
  ADD,
  SUBTRACT,
  MULTIPLY,
  DIVIDE,
  APPLY,
  UNDO,
  BACKSPACE,
} from './calculator';

test('input the first digit', (t) => {
  const state = [{
    type: '@init'
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }].reduce(calculator, undefined);
  t.is(state.display, 1);
});

test('the first operation commits a set to history', (t) => {
  const state = [{
    type: '@init',
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: ADD,
  }].reduce(calculator, undefined);
  t.deepEqual(state.history, [{ type: SET, number: 1 }]);
  t.is(state.pending, ADD);
});

test('after an apply, a digit input triggers a SET and overwrites', (t) => {
  const state = [{
    type: '@init',
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: ADD
  }, {
    type: INPUT_DIGIT,
    digit: 2,
  }, {
    type: APPLY,
  }, {
    type: INPUT_DIGIT,
    digit: 5,
  }].reduce(calculator, undefined);
  t.is(state.pending, SET);
  t.is(state.display, 5);
});

test('addition', (t) => {
  const state = [{
    type: '@init',
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: ADD,
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: APPLY,
  }].reduce(calculator, undefined);
  t.is(state.display, 2);
});

test('subtraction', (t) => {
  const state = [{
    type: '@init',
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: SUBTRACT,
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: APPLY,
  }].reduce(calculator, undefined);
  t.is(state.display, 0);
});

test('multiplication', (t) => {
  const state = [{
    type: '@init',
  }, {
    type: INPUT_DIGIT,
    digit: 2,
  }, {
    type: MULTIPLY,
  }, {
    type: INPUT_DIGIT,
    digit: 9,
  }, {
    type: APPLY,
  }].reduce(calculator, undefined);
  t.is(state.display, 18);
});

test('division', (t) => {
  const state = [{
    type: '@init',
  }, {
    type: INPUT_DIGIT,
    digit: 6,
  }, {
    type: DIVIDE,
  }, {
    type: INPUT_DIGIT,
    digit: 2,
  }, {
    type: APPLY,
  }].reduce(calculator, undefined);
  t.is(state.display, 3);
});

test('resumes as normal after an apply', (t) => {
  const state = [{
    type: '@init',
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: ADD,
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: APPLY
  }, {
    type: ADD,
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: APPLY,
  }].reduce(calculator, undefined);
  t.is(state.display, 3);
});;

test('you can overwrite after an apply', (t) => {
  const state = [{
    type: '@init',
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: ADD,
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: APPLY
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: APPLY,
  }].reduce(calculator, undefined);
  t.is(state.display, 1);
});

test('undo', (t) => {
  const state = [{
    type: '@init'
  }, {
    type: INPUT_DIGIT,
    digit: 6,
  }, {
    type: APPLY,
  }, {
    type: ADD,
  }, {
    type: INPUT_DIGIT,
    digit: 10,
  }, {
    type: APPLY,
  }, {
    type: UNDO,
  }].reduce(calculator, undefined);
  t.is(state.display, 6);
});

test('an undo with no history results in no change', (t) => {
  const state = [{
    type: '@init',
  }, {
    type: UNDO,
  }].reduce(calculator, undefined);
  t.deepEqual(state, calculator(undefined, { type: '@init' }));
});

test('an apply with no history results in no change', (t) => {
  const state = [{
    type: '@init',
  }, {
    type: APPLY,
  }].reduce(calculator, undefined);
  t.deepEqual(state, calculator(undefined, { type: '@init' }));
});

test('an apply after an apply repeats the last operation', (t) => {
  const state = [{
    type: '@init'
  }, {
    type: INPUT_DIGIT,
    digit: 6,
  }, {
    type: APPLY,
  }, {
    type: ADD,
  }, {
    type: INPUT_DIGIT,
    digit: 10,
  }, {
    type: APPLY,
  }, {
    type: APPLY
  }].reduce(calculator, undefined);
  t.is(state.display, 26);
});

test('clear display', (t) => {
  let state = [{
    type: '@init',
  }, {
    type: INPUT_DIGIT,
    digit: 5
  }, {
    type: CLEAR_DISPLAY,
  }].reduce(calculator, undefined);
  t.is(state.display, 0);
  state = [{
    type: '@init',
  }, {
    type: INPUT_DIGIT,
    digit: 5
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: CLEAR_DISPLAY,
  }].reduce(calculator, undefined);
  t.is(state.display, 0);
  state = [{
    type: INPUT_DIGIT,
    digit: 3
  }].reduce(calculator, state);
  t.is(state.display, 3);
});

test('RESET returns calculator to original state', (t) => {
  const state = [{
    type: '@init'
  }, {
    type: INPUT_DIGIT,
    digit: 6,
  }, {
    type: APPLY,
  }, {
    type: ADD,
  }, {
    type: INPUT_DIGIT,
    digit: 10,
  }, {
    type: APPLY,
  }, {
    type: APPLY
  }, {
    type: RESET,
  }].reduce(calculator, undefined);
  t.deepEqual(state, calculator(undefined, { type: '@init' }));
})

test('BACKSPACE removes the last digit', (t) => {
  const state = [{
    type: '@init',
  }, {
    type: INPUT_DIGIT,
    digit: 6,
  }, {
    type: INPUT_DIGIT,
    digit: 1,
  }, {
    type: BACKSPACE,
  }].reduce(calculator, undefined);
  t.is(state.display, 6);
});
