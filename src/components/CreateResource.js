import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Modal({ contract, currentUser }) {
  // show/hide modal
  const [showModal, setShowModal] = useState(false);
  // set resource fields
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  // set disabled attr
  const [loading, setLoading] = useState(false);
  // set categories array
  const [categories, setCategories] = useState([]);
  // show category input field if user doesn't select from dropdown
  const [categoryField, setCategoryField] = useState(false)
  // notifications
  const [created, setCreated] = useState(true);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // invoke the smart contract's addResource method
    if (category === "" || title === null || url === null){
      setLoading(false);
      setCreated(false)
      notify()
    } else {
      setCreated(true)
      const resource = await contract.addResource({ title, category, url, accountId: currentUser.accountId})
      .then(() => {
        setTitle("");
        setUrl("");
        setCategory("");
        setLoading(false);
        setShowModal(false);
        setCreated(false)
        notify('resource added')
      })
      .catch(error => {
        console.log('error', error)
        setCreated(false)
      });

      // print the resource to the console
      console.log('my resource', resource);
    }
    
  }

  /// fetch categories
  useEffect(() => {
    const categoryId = setInterval(() => {
      contract
        .getCategories()
        .then((categories) => {console.log(categories);setCategories(categories)})
    }, 1000);

    return () => clearInterval(categoryId);
  }, [contract]);

  const notify = (type) => {
    switch (type) {
      default:
      toast.error("Field can't be empty!", {
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
      case 'resource added':
        toast.success('Resource successfully added!', {
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
    <div className="p-6 ml-5 ">
      <p className="text-xl text-gray-800 mb-3 ml-5">Did you come across a useful resource lately, <span className="text-gray-700 font-bold ">{ currentUser.accountId }</span> ?</p>
      <p className="text-xl text-gray-800 mt-1 ml-5 mb-6">Share it with the NEAR community!</p>
      <button
          className="flex justify-end bg-blue-700 text-center text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ml-5"
          type="button"
          onClick={() => setShowModal(true)}
      >
          Add a New Resource
      </button>
    </div>
      
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Add New Resource
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                <form onSubmit={handleSubmit} className="w-full rounded px-8 pt-6 pb-8 mb-4">
                  <fieldset id="fieldset">
                  <p className="text-xl font-bold text-gray-800">Please fill out all fields with the correct information.</p>

                    <div className="highlight max-w-sm pt-6">
                      <label htmlFor="title" className="block tracking-wide text-gray-700 text-sm font-bold mb-2">Resource Title</label>
                      <input
                        autoComplete="off"
                        autoFocus
                        id="title"
                        // placeholder="fdsfds"
                        //required
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="highlight max-w-sm">
                      <label htmlFor="url" className="block tracking-wide text-gray-700 text-sm font-bold mb-2 mt-5">Resource URL</label>
                      <input
                        autoComplete="off"
                        autoFocus
                        id="url"
                        //required
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="highlight max-w-sm pt-6 mb-4">
                      <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>

                      <p className="text-xs mb-4">To add a new category select <strong>-- ADD NEW CATEGORY --</strong></p>
                      <div className="relative w-2/3	"> 
                        <select 
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                        id="grid-state"
                        value={category}
                        onChange={({ target }) => {setCategory(target.value); if(target.value === ""){setCategoryField(true)} else {setCategoryField(false)}}}
                        >
                          <option value="" disabled defaultValue="selected">Select your option</option>
                          <option
                            value=""
                            className="font-bold text-red-700"
                          >-- ADD NEW CATEGORY --
                          </option>

                          {categories.map((individualCategory, index) => (
                            <option 
                            key={index} 
                            id={index}
                            value={individualCategory}
                            > 
                              {individualCategory} 
                            </option>
                          ))}

                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>

                      {categoryField ? (
                        <>
                          <input
                            autoComplete="off"
                            autoFocus
                            placeholder="Add new category"
                            id="category"
                            value={category}
                            onChange={({ target }) => setCategory(target.value)}
                            className="shadow appearance-none border rounded w-full mt-3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </>
                      ) : null}
                      
                    </div>
                    <button type="submit" disabled={loading} className="shadow bg-blue-700 hover:bg-blue-800 focus:shadow-outline focus:outline-none text-white font-bold mt-3 py-2 px-4 rounded">
                      Submit
                    </button>
                  </fieldset>
                </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setShowModal(false); 
                      setTitle("");
                      setUrl("");
                      setCategory("");
                      setLoading(false);
                      setCategoryField(false)
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
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
        </>

        
      ) : null}
    </>
  );
}