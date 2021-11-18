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
    <form onSubmit={handleSubmit} className="w-full rounded px-8 pt-6 pb-8 mb-4">
      <fieldset id="fieldset">
        <p className="text-xl font-bold text-gray-800">Did you stumble upon a useful resource lately, { currentUser.accountId }? Share it with the NEAR community!</p>
        <p className="highlight max-w-sm pt-6">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Resource Title:</label>
          <input
            autoComplete="off"
            autoFocus
            id="title"
            // placeholder="fdsfds"
            required
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </p>
        <p className="highlight max-w-sm">
          <label htmlFor="url" className="block text-gray-700 text-sm font-bold mb-2">Resource URL:</label>
          <input
            autoComplete="off"
            autoFocus
            id="url"
            required
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </p>
        <p className="highlight max-w-sm">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
          <input
            autoComplete="off"
            autoFocus
            id="category"
            required
            value={category}
            onChange={({ target }) => setCategory(target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
        <button type="submit" disabled={loading} className="shadow bg-yellow-400 hover:bg-yellow-300 focus:shadow-outline focus:outline-none text-white font-bold mt-3 py-2 px-4 rounded">
          Submit
        </button>
      </fieldset>
    </form>


    
  );
}

export default CreateResource;