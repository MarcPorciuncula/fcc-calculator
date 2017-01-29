import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import range from 'lodash/range';
import findLastIndex from 'lodash/findLastIndex';
import classnames from 'classnames';

import { INPUT_DIGIT, ADD, MULTIPLY, SUBTRACT, DIVIDE, APPLY, UNDO, BACKSPACE, RESET } from './reducers/calculator';
import './Calculator.css';
import calculate from './reducers/calculation';

function Key({ children, text, ...rest }) {
  return (
    <button className={classnames('key', { text })} {...rest}>
      {children}
    </button>
  )
}

function HistoryEntry({ type, number }) {
  let operator;
  switch (type) {
    case 'ADD':
      operator = '+';
      break;
    case 'SUBTRACT':
      operator = '-';
      break;
    case 'MULTIPLY':
      operator = '×';
      break;
    case 'DIVIDE':
      operator = '÷';
      break;
    default:
      operator = '';
      break;
  }
  return (
    <span><span className="operator">{operator}</span>{number}</span>
  );
}

class Calculator extends React.Component {
  render() {

    let projected = '_';
    if (this.props.pending && !this.props.overwrite) {
      projected = [...this.props.history, { type: this.props.pending, number: parseFloat(this.props.display) }].reduce(calculate, undefined) || 0;
    }

    const history = this.props.history
      .slice(findLastIndex(this.props.history, ({ type }) => type === 'SET'))
      .map(({ type, number }, i) => (
        <HistoryEntry type={type} number={number} key={i}/>
      ));
    if (this.props.pending && this.props.pending !== 'SET') {
      history.push(<HistoryEntry type={this.props.pending} number="" key="pending"/>);
    }

    return (
      <div className="calculator">
        <div className="display">
          <div className="overflow-container-end">
            <p className="history">
              {history}
            </p>
          </div>
          <div className="overflow-container-end">
            <p className="current-value">
              {this.props.display}
            </p>
          </div>
          <div className="overflow-container-end">
            <p className="result">
              {projected}
            </p>
          </div>
        </div>
        <div className="controls">
          <div className="numpad">
            <Key onClick={() => this.props.input('.')}>.</Key>
            <Key onClick={() => this.props.input(0)}>0</Key>
            <Key onClick={this.props.apply}>=</Key>
            {range(1, 10).map((n) => (
              <Key key={n} onClick={() => this.props.input(n)}>{n}</Key>
            ))}
          </div>
          <div className="operations">
            {this.props.display === '0' ?
              <Key text onClick={this.props.clear}>CLR</Key>
              :
              <Key text onClick={this.props.backspace}>DEL</Key>
            }
            <Key onClick={this.props.divide}>÷</Key>
            <Key onClick={this.props.multiply}>×</Key>
            <Key onClick={this.props.subtract}>-</Key>
            <Key onClick={this.props.add}>+</Key>
          </div>
        </div>
      </div>
    );
  }
}

Calculator.propTypes = {
  display: PropTypes.string.isRequired,
  history: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
  })).isRequired,
  input: PropTypes.func,
  add: PropTypes.func,
  apply: PropTypes.func,
  multiply: PropTypes.func,
  divide: PropTypes.func,
  subtract: PropTypes.func,
  backspace: PropTypes.func,
  clear: PropTypes.func,
  undo: PropTypes.func,
}

export default connect(
  (state) => ({
    display: state.calculator.display,
    history: state.calculator.history,
    pending: state.calculator.pending,
    overwrite: state.calculator.overwrite,
  }),
  (dispatch) => ({
    input: (digit) => dispatch({ type: INPUT_DIGIT, digit, }),
    add: () => dispatch({ type: ADD }),
    subtract: () => dispatch({ type: SUBTRACT }),
    multiply: () => dispatch({ type: MULTIPLY }),
    divide: () => dispatch({ type: DIVIDE }),
    backspace: () => dispatch({ type: BACKSPACE }),
    apply: () => dispatch({ type: APPLY }),
    undo: () => dispatch({ type: UNDO }),
    clear: () => dispatch({ type: RESET }),
  }),
)(Calculator);
