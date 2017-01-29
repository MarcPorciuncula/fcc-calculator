import calculate from './calculation';

export const INPUT_DIGIT = 'INPUT_DIGIT';
export const SET = 'SET';
export const ADD = 'ADD';
export const SUBTRACT = 'SUBTRACT';
export const MULTIPLY = 'MULTIPLY';
export const DIVIDE = 'DIVIDE';
export const APPLY = 'APPLY';
export const UNDO = 'UNDO';
export const CLEAR_DISPLAY = 'CLEAR_DISPLAY';
export const BACKSPACE = 'BACKSPACE';
export const RESET = 'RESET';

const DEFAULT_STATE = {
  display: 0,
  pending: null,
  overwrite: true,
  history: [],
};

export default function calculator(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case CLEAR_DISPLAY:
      return Object.assign({}, state, {
        display: 0,
      });
    case BACKSPACE:
      if (state.display.toString().length <= 1) {
        return Object.assign({}, state, {
          display: 0,
        });
      } else {
        return Object.assign({}, state, {
          display: parseInt(state.display.toString().substr(0, state.display.toString().length - 1), 10),
        });
      }
    case INPUT_DIGIT:
      if (state.overwrite) {
        return Object.assign({}, state, {
          display: action.digit,
          pending: state.pending ? state.pending : SET, // if you start typing when there's nothing pending, it becomes a SET
          overwrite: false,
        });
      } else {
        return Object.assign({}, state, {
          display: parseInt(`${state.display}${action.digit}`, 10),
        });
      }
    case RESET:
      return DEFAULT_STATE;
    case ADD:
    case SUBTRACT:
    case MULTIPLY:
    case DIVIDE:
      if (state.pending && state.overwrite) { // they didnt enter a number after the operation...
        return Object.assign({}, state, {
          pending: action.type,
        });
      } else if (state.pending) {
        return Object.assign({}, state, {
          overwrite: true,
          pending: action.type,
          history: [...state.history, { type: state.pending, number: state.display }],
        });
      } else {
        return Object.assign({}, state, {
          overwrite: true,
          pending: action.type,
        });
      }
    case APPLY: {
      let history = state.history;
      if (state.pending) {
        history = [...history, { type: state.pending, number: state.display }];
      } else if (history.length) {
        history = [...history, history[history.length - 1]];
      }
      return Object.assign({}, state, {
        display: history.reduce(calculate, undefined) || 0,
        overwrite: true,
        pending: null,
        history,
      });
    }
    case UNDO: {
      const history = state.history.slice(0, state.history.length - 1);
      return Object.assign({}, state, {
        display: history.reduce(calculate, undefined) || 0,
        overwrite: true,
        pending: null,
        history,
      });
    }
    default:
      return state;
  }
}
