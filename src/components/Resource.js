// src/components/Todo.js
import { useState } from "react";
// get our fontawesome imports
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Big from 'big.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ATTACHED_GAS = Big(3).times(10 ** 13).toFixed();

export function Resource({ contract, creator, url, title, category, vote_score, votes,  id, currentUser, total_donations }) {
  // check if already voted
  const [voted, setVoted] = useState(votes.indexOf(currentUser.accountId) === -1 ? -1 : 0)
  // button hover
  const [over, setOver] = useState(false);
  //button clicked
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(true);
  // vote count
  const [voteCount, setVoteCount] = useState(vote_score);
  const [donated, setDonated] = useState("");
  
  const handleClick = async (event) => {
    // Increment vote count by 1
    console.log('id',id)
    setVoteCount(voteCount + 1);
    setLoading(true)
    // call contract funciton addVote
    const vote = await contract.addVote({ resourceId: id, voter: currentUser.accountId, value: 1})
    .then(() => {
      setVoted(0)
    })
    .catch(error => {
      console.log('error', error)
      setCreated(false)
      notify()
      setVoteCount(voteCount);
    });
    console.log('vote', vote)
  }

  const handleDonation = async () => {
    // call contract funciton addDonation
    const donation = await contract.addDonation({ resourceId: id}, ATTACHED_GAS, 
    Big({donated}.donated).times(10 ** 24).toFixed());
    console.log('donation', donation)
  }

  const notify = () => {
    toast.error("You can't vote your own resource!", {
      theme: "dark",
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  //const tagColor = ['bg-red-300', 'bg-blue-500', 'bg-yellow-600']

  return (
    <>
      <div className="max-w-4xl	p-4">
        <div className="p-8 bg-white rounded shadow-md relative">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="font-bold	">{creator}</p>
          <a href={url} rel="noreferrer" target="_blank">{url}</a>
          <div
            className="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-green-200 text-green-700 rounded-full"
          >
            {category}
          </div>
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
              className="shadow appearance-none border rounded w-1/5 py-2 px-3 ml-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              max={currentUser.balance}
              min="0"
              step="0.01"
              type="number"
              value={donated}
              onChange={({ target }) => setDonated(target.value)}
            />
            <span title="NEAR Tokens" className="pl-2">Ⓝ</span>
            <button 
              onClick={handleDonation}
              className="shadow bg-blue-700 hover:bg-blue-800 focus:shadow-outline focus:outline-none text-white font-bold mt-3 ml-3 py-2 px-4 text-base rounded">Donate
            </button>
          </div>
        
          <div className="absolute bottom-5 right-0 h-16 w-16">
            <button 
              onClick={handleClick}
              onMouseOver={() => setOver(true)}
              onMouseLeave={() => setOver(false)}
              className={voted ? "disabled:opacity-50 " : "text-blue-700"}
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

        {created ? "" :
          <div>
            <p className={created ? "invisible" : "visible"}></p>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover 
            
            />
          </div>
        }
      </div>
    </>
  );
}