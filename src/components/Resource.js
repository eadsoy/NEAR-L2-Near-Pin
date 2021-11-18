// src/components/Todo.js
import { useState } from "react";
// get our fontawesome imports
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Resource({ contract, creator, url, title, category, vote_score, id, currentUser }) {
  // button hover
  const [over, setOver] = useState(false);

  // upvote count
  const [count, setCount] = useState(vote_score);

  function handleClick() {
    setCount(count + 1);
    // addVote(voter: string, value: i8, resourceId: i32 )
    contract.addVote({ resourceId: id, voter: currentUser.accountId, value: 1});
  }
  //const [vote, setVote] = useState(0);
  
  // const upvote = ({ target }) => {
  //   setVote(target.checked);
  //   contract.update({ id, updates: { task, done: target.checked } });
  // };

  
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
            <div className="absolute  bottom-5 right-0 h-16 w-16">
              <button 
              onClick={handleClick}
              onMouseOver={() => setOver(true)}
              onMouseLeave={() => setOver(false)}>
                <FontAwesomeIcon 
                icon={faCaretUp} 
                size="3x" 
                style={over ? { color: "#505050" } : {}} />
              </button>
            <p>{count}</p>
            </div>
            
            
          </div>
      </div>
    
    </>
  );
}