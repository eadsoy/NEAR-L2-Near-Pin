import React, { useState }  from 'react';

const CreateResource = ({ contract, currentUser }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    // invoke the smart contract's addResource method
    const resource = await contract.addResource({ title, category, url, accountId: currentUser.accountId});
    setTitle("");
    setUrl("");
    setCategory("");
    setLoading(false);

    // print the todo to the console
    console.log('my resource', resource);
  };
  return (
    <form onSubmit={handleSubmit}>
      <fieldset id="fieldset">
        <p>Did you stumble upon a useful resource lately, { currentUser.accountId }? Share it with the NEAR community!</p>
        <p className="highlight">
          <label htmlFor="title">Resource Title:</label>
          <input
            autoComplete="off"
            autoFocus
            id="title"
            // placeholder="fdsfds"
            required
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </p>
        <p className="highlight">
          <label htmlFor="url">Resource URL:</label>
          <input
            autoComplete="off"
            autoFocus
            id="url"
            required
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </p>
        <p className="highlight">
          <label htmlFor="category">Category:</label>
          <input
            autoComplete="off"
            autoFocus
            id="category"
            required
            value={category}
            onChange={({ target }) => setCategory(target.value)}
          />
        </p>
        {/* <p>
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
        </p> */}
        <button type="submit" disabled={loading}>
          Submit
        </button>
      </fieldset>
    </form>
    
  );
}

export default CreateResource;