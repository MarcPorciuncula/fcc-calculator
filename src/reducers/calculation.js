
const DEFAULT_STATE = 0;

export default function calculation(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case 'SET':
      return action.number;
    case 'ADD':
      return state + action.number;
    case 'MULTIPLY':
      return state * action.number;
    case 'SUBTRACT':
      return state - action.number;
    case 'DIVIDE':
      return state / action.number;
    default:
      return state;
  }
}
