import { useState } from "react";
// Fontawesome imports
// https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
// Big.js imports
// https://github.com/MikeMcl/big.js/
import Big from 'big.js';
// React toastify imports 
// https://github.com/fkhadra/react-toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ATTACHED_GAS = Big(3).times(10 ** 13).toFixed();

export function Resource({ contract, creator, url, title, category, vote_score, votes, id, currentUser, total_donations, bookmarks, linked_categories}) {
  // check if already voted
  const [voted, setVoted] = useState(votes.indexOf(currentUser.accountId) === -1 ? -1 : 0)
  // button hover
  const [over, setOver] = useState(false);
  // button clicked
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(true);
  // vote count
  const [voteCount, setVoteCount] = useState(vote_score);
  const [donated, setDonated] = useState("");
  const [bookmarked, setBookmarked] = useState(false)

  const handleClick = async (event) => {
    // increment vote count by 1
    console.log('id',id)
    setVoteCount(voteCount + 1);
    setLoading(true)
    // call contract function addVote
    const vote = await contract.addVote({ resourceId: id, voter: currentUser.accountId, value: 1})
    .then(() => {
      setVoted(0)
      setCreated(false)
      notify("success")
    })
    .catch(error => {
      console.log('error', error)
      setCreated(false)
      notify('error')
      setVoteCount(voteCount);
    });
    console.log('vote', vote)
  }

  const handleDonation = async () => {
    // call contract function addDonation
    const donation = await contract.addDonation({ resourceId: id }, ATTACHED_GAS, 
    Big({donated}.donated).times(10 ** 24).toFixed());
    console.log('donation', donation)
  }

  const handleAddBookmark = async () => {
    await contract.addBookmark({ resourceId: id })
    setBookmarked(true)
  }
  const handleRemoveBookmark = async () => {
    await contract.removeBookmark({ resourceId: id })
    setBookmarked(false)
  }


  const allColors = ["blue", "green", "red", "yellow", "purple", "gray", "rose", "teal", "cool-gray"]



  const notify = (type) => {
    switch (type) {
      default:
      toast.error("You can't vote your own resource!", {
        theme: "colored",
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      break;
      case 'success':
        toast.success('Vote submitted!', {
          icon: "🚀",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      break;
    }
  }

  return (
    <>
      <div className="max-w-3xl	p-4">
        <div className="p-8 bg-white rounded shadow-xl relative">
          <div className="flex flex-row">
            <h2 className="text-2xl font-bold text-gray-800 mr-4">{title}</h2>

            {linked_categories.map((categoryIndex, index) => {
              return <div key ={categoryIndex} className={`ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-${allColors[categoryIndex % 9]}-200 text-${allColors[categoryIndex % 9]}-700 rounded-full`}>{category[index]}</div>
            })} 
 
            <div className="absolute top-12 right-2 h-16 w-16 flex flex-col items-center ">
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
                />
              </button>
              <p>{voteCount}</p>
              
            </div>
            <div className="absolute top-0 right-12 h-1 w-2 flex flex-col items-center ">
            {bookmarked? 
            <button 
                onClick={handleRemoveBookmark}
                className="shadow text-xs bg-purple-800 hover:bg-purple-900 focus:shadow-outline focus:outline-none text-white font-bold mt-3 py-2 px-4 ml-4 rounded"
                disabled = {loading}
              >Bookmarked</button> 
              : 
              <button 
                onClick={handleAddBookmark}
                className="shadow text-xs bg-purple-800 hover:bg-purple-900 focus:shadow-outline focus:outline-none text-white font-bold mt-3 py-2 px-4 ml-4 rounded"
                disabled = {loading}
              >Bookmark</button> 
            }
            </div>

          </div>
          <p className="font-bold	pt-1 mb-5 text-gray-500"><span className="text-xs pr-2">Added by </span>{creator}</p>
          <a href={url} rel="noreferrer" target="_blank" className="text-lg font-bold text-blue-800 pt-6 mt-6 mb-6 pb-6">{url}</a>
           
          <div className="pt-6 text-sm flex flex-row justify-items-center items-center	place-items-center">     
            <div>
              <label htmlFor="donation">Say thanks to {creator}</label>
              <input
                autoComplete="off"
                id="donation"
                className="shadow appearance-none border rounded w-1/5 py-2 px-2 ml-6 pl-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                max={currentUser.balance}
                min="0"
                step="0.01"
                type="number"
                placeholder="0"
                value={donated}
                onChange={({ target }) => setDonated(target.value)}
              />
              <span title="NEAR Tokens" className="pl-2">Ⓝ</span>
              <button 
                onClick={handleDonation}
                className="shadow bg-blue-500 hover:bg-blue-600 focus:shadow-outline focus:outline-none text-white font-bold mt-3 ml-3 py-1 px-3 text-base rounded">Donate
              </button>
            </div>
            <div className="flex flex-row pt-4 ">
              <label htmlFor="donation">Donations</label>
              {/* <p className="pl-6 ml-3">{total_donations/1e24}<span title="NEAR Tokens" className="pl-2">Ⓝ</span></p> */}
              <div
                className="ml-6 pl-4 text-s inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
               {total_donations/1e24}<span title="NEAR Tokens" className="pl-2">Ⓝ</span>
              </div>
            </div>
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