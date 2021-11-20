// src/components/Todo.js
import { useState } from "react";
// get our fontawesome imports
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Big from 'big.js';


const ATTACHED_GAS = Big(3).times(10 ** 13).toFixed();

export function Resource({ contract, creator, url, title, category, vote_score, id, currentUser, total_donations }) {
  // button hover
  const [over, setOver] = useState(false);
  // vote count
  const [voteCount, setVoteCount] = useState(vote_score);

  const [donation, setDonation] = useState("");

  function handleClick() {
    // Increment vote count by 1
    setVoteCount(voteCount + 1);

    // call contract funciton addVote
    contract.addVote({ resourceId: id, voter: currentUser.accountId, value: 1});
  }

  function handleDonation() {
    // Increment vote count by 1
    // call contract funciton addVote
    contract.addDonation({ resourceId: id}, ATTACHED_GAS, 
    Big({donation}.donation).times(10 ** 24).toFixed());
  }
  
  
  // const del = () => {
  //   // on clicking the delete button invoke the del method on
  //   // the smart contract
  //   contract.addVote({ id });
  // };

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
            

           <div>
     
            <label htmlFor="donation">Donation (optional):</label>
              <p>{total_donations/1e24}<span title="NEAR Tokens">Ⓝ</span></p>
              <input
                autoComplete="off"
                defaultValue={'0'}
                id="donation"
                max={currentUser.balance}
                min="0"
                step="0.01"
                type="number"
                value={donation}
                onChange={({ target }) => setDonation(target.value)}
              />
              <span title="NEAR Tokens">Ⓝ</span>
              <button 
              onClick={handleDonation}>Donate</button>
           </div>
         
            <div className="absolute bottom-5 right-0 h-16 w-16">
              <button 
              onClick={handleClick}
              onMouseOver={() => setOver(true)}
              onMouseLeave={() => setOver(false)}>
                <FontAwesomeIcon 
                icon={faCaretUp} 
                size="3x" 
                style={over ? { color: "#505050" } : {}} />
              </button>
            <p>{voteCount}</p>
            </div>
            
            
          </div>
      </div>
    
    </>
  );
}