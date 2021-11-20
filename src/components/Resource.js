// src/components/Todo.js
import { useState } from "react";
// get our fontawesome imports
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Big from 'big.js';


const ATTACHED_GAS = Big(3).times(10 ** 13).toFixed();

export function Resource({ contract, creator, url, title, category, vote_score, votes,  id, currentUser, total_donations }) {
  // button hover
  const [test, setTest] = useState(votes.indexOf(currentUser.accountId))
 
  const [over, setOver] = useState(false);
  //button clicked
  const [loading, setLoading] = useState(false);

  // vote count
  const [voteCount, setVoteCount] = useState(vote_score);
  
  const [donation, setDonation] = useState("");
  
  function handleClick() {
    // Increment vote count by 1
    setVoteCount(voteCount + 1);
    setLoading(true)
    setTest(0)
    // call contract funciton addVote
    console.log('id',id)
    contract.addVote({ resourceId: id, voter: currentUser.accountId, value: 1});
  }

  function handleDonation() {
    // Increment vote count by 1
    // call contract funciton addVote
    contract.addDonation({ resourceId: id}, ATTACHED_GAS, 
    Big({donation}.donation).times(10 ** 24).toFixed());
  }
  
  return (
    <>
      <div className="max-w-4xl	p-4">
        <div className="p-8 bg-white rounded shadow-md relative">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="font-bold	">{creator}</p>
          <a href={url} rel="noreferrer" target="_blank">{url}</a>
          <p>{category}</p>
          {/* <p>
            <input type="checkbox" checked={checked} onChange={complete} />
            {task}
          </p> */}  
          <div className="pt-6">
            <div className="flex flex-row">
              <label htmlFor="donation">Total Donations:</label>
              <p className="pl-6 ml-3">{total_donations/1e24}<span title="NEAR Tokens" className="pl-2">Ⓝ</span></p>
            </div>
            
            <label htmlFor="donation">Donation (optional):</label>
            <input
              autoComplete="off"
              //defaultValue={'0'}
              autoFocus
              id="donation"
              className="shadow appearance-none border rounded w-1/5 py-2 px-4 ml-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              max={currentUser.balance}
              min="0"
              step="0.01"
              type="number"
              value={donation}
              onChange={({ target }) => setDonation(target.value)}
            />
            <span title="NEAR Tokens" className="pl-2">Ⓝ</span>
            <button 
              onClick={handleDonation}
              className="shadow bg-blue-700 hover:bg-blue-800 focus:shadow-outline focus:outline-none text-white font-bold mt-3 ml-3 py-2 px-4 rounded">Donate
            </button>
          </div>
        
          <div className="absolute bottom-5 right-0 h-16 w-16">
            <button 
              onClick={handleClick}
              onMouseOver={() => setOver(true)}
              onMouseLeave={() => setOver(false)}
              className={test ? "disabled:opacity-50 " : "text-blue-700"}
              disabled = {loading}
            >
              <FontAwesomeIcon 
                icon={faCaretUp} 
                size="3x" 
                className={over ? "text-blue-700" : "" }
                //style={over ? { color: "#505050" } : {} }
              />
            </button>
            <p>{voteCount}</p>
          </div>
        </div>
      </div>
    </>
  );
}