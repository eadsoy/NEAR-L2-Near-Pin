import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function Form({ onSubmit, currentUser }) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>Did you stumble upon a useful resource lately, { currentUser.accountId }? Share it with the NEAR community!</p>
        <p className="highlight">
          <label htmlFor="url">Resource URL:</label>
          <input
            autoComplete="off"
            autoFocus
            id="url"
            required
          />
        </p>
        <p>
          <label htmlFor="donation">Donation (optional):</label>
          <input
            autoComplete="off"
            defaultValue={'0'}
            id="donation"
            max={Big(currentUser.balance).div(10 ** 24)}
            min="0"
            step="0.01"
            type="number"
          />
          <span title="NEAR Tokens">Ⓝ</span>
        </p>
        <p>
          <label htmlFor="vote">Vote:</label>
          <input
            autoComplete="off"
            defaultValue={'0'}
            id="vote"
            max="1"
            min="0"
            type="number"
          />
          <span title="vote"></span>
        </p>
        <button type="submit">
          Submit
        </button>
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  })
};
