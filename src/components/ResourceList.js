// src/components/ResourceList.js
import { useEffect, useState } from "react";
import { Resource } from "./Resource";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const PER_PAGE_LIMIT = 10;

const ResourceList = ({ contract, currentUser}) => {
  const [resources, setResources] = useState([]);
  // sort resources by vote_count
  const [sortedResources, setSortedResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState([])
  const [resourceCount, setResourceCount] = useState(0)
  const [categories, setCategories] = useState([])
  const [filtered, setFiltered] = useState(false)
  const [checkedState, setCheckedState] = useState(
    new Array(20).fill(false)
  );
  
  // useEffect(() => {setCheckedState(Array.from({ length: categories.length },(v, k) => false))}, [categories])

  //console.log('checkedState1', checkedState)

  const filter = async ({ target }) => {
    console.log('checkedState2', checkedState)
    const updatedCheckedState = checkedState.map((item, index) => 
      index === parseInt(target.id,10) ? !item : item
    );

    
    setCheckedState(updatedCheckedState);
    // console.log('checkedState[parseInt(target.id,10', checkedState[parseInt(target.id,10)])
    // console.log('target.id', target.id)


    if(checkedState[parseInt(target.id,10)] === true) {
      console.log('hello')
      setFiltered(true)
      const linkedResources = await contract.getLinkedResources({categoryTitle: target.value})
      setFilteredResources(linkedResources)
      console.log('linkedResources', linkedResources)
    } else {
      setFiltered(false)
    }
  };

  useEffect(() => {
    let offset;
    let sliceOffset;
    if(page === 1) {
      setPage(1);
      offset = resourceCount - PER_PAGE_LIMIT;
      // if(resourceCount < PER_PAGE_LIMIT) {
      //   offset = resourceCount
      // } else {
      //   offset = resourceCount - PER_PAGE_LIMIT;
      // }
      sliceOffset = 0;
    } else {
      offset = resourceCount - (page) * PER_PAGE_LIMIT;
      
      sliceOffset = (page - 1) * PER_PAGE_LIMIT;
    }

    // every second after the component first mounts
    // update the list of resources by invoking the getResources
    // method on the smart contract
    const id = setInterval(() => {
       contract
        .getResourcesByRange({ startIndex: offset < 0 ? 0 : offset, endIndex: offset + PER_PAGE_LIMIT})
        .then((resources) => { 
          if (resources.length < 10) {
            setLoading(true)
            setResources(resources);
          } else {
            setLoading(false)
            setResources(resources);
          }
        })
    }, 1000);

    const idSorted = setInterval(() => {
       contract
        .sortByVoteCount()
        .then((resources) => { 
          let sortedResources = resources.slice(sliceOffset, sliceOffset + PER_PAGE_LIMIT)
          setSortedResources(sortedResources) 
          })
    }, 1000);
    
    // check resources length and set page count
    const totalResources = setInterval(() => {
      contract
       .getResourceCount()
       .then((resourceCount) => { 
         setTotalPageCount(Array.from({ length: Math.ceil(resourceCount / PER_PAGE_LIMIT) },(v, k) => k + 1))
         setResourceCount(resourceCount)
         })
   }, 1000);

    const idCategories = setInterval(() => {
      contract
      .getCategories()
      .then((categories) => { 
        setCategories(categories) 
      })
    }, 1000);

    return () => {
      clearInterval(id);
      clearInterval(idSorted);
      clearInterval(totalResources)
      clearInterval(idCategories)
    }
  }, [page, contract, resourceCount]);

  return (
    <>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Tabs defaultIndex={0} onSelect={() => {setPage(1)}} className="pt-6 mt-6">
            <TabList>
              <Tab>Recent</Tab>
              <Tab>Popular</Tab>
              <Tab>Filter</Tab>
            </TabList>
            <TabPanel>
              <ul>
                <div className="flex">
                  Current Page: {page}
                </div>
                <nav aria-label="Page navigation">
                  <ul className="inline-flex">
                    <li><button className={page === 1? "invisible" :"h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-l-lg focus:shadow-outline hover:bg-indigo-100"} onClick={() => setPage((page) => page - 1)}>Prev</button></li>
                    
                    {totalPageCount.map((index) => {
                      return <li><button key={index} className="h-10 px-5 text-white transition-colors duration-150 bg-indigo-600 focus:shadow-outline" onClick={() => setPage(index)}>{index}</button></li>
                    })}

                    <li><button className={loading? "invisible" : "h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-indigo-100"} onClick={() => setPage((page) => page + 1)}>Next</button></li>
                  </ul>
                </nav>
                {filtered ?
                  (<div>
                  {filteredResources.map((resource) => (
                    <li key={resource.resourceId} className="pl-6 ml-6 mt-6 pt-6">
                      <Resource id={resource.resourceId} contract={contract}{...resource}  currentUser={currentUser}/>
                    </li>
                  ))}
                  
                  </div>)
                  : 
                  (<div>
                    {resources.map((resource) => (
                    <li key={resource.resourceId} className="pl-6 ml-6 mt-6 pt-6">
                      <Resource id={resource.resourceId} contract={contract}{...resource}  currentUser={currentUser}/>
                    </li>
                  )).reverse()}
                  
                  </div>)
                }
                
                
                

              </ul>
            </TabPanel>
            <TabPanel>
            <ul>
              <div className="flex">
                Current Page: {page}
              </div>
              <nav aria-label="Page navigation">
                  <ul className="inline-flex">
                    <li><button className={page === 1? "invisible" :"h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-l-lg focus:shadow-outline hover:bg-indigo-100"} onClick={() => setPage((page) => page - 1)}>Prev</button></li>
                    {totalPageCount.map((index) => {
                      return <li><button key={index} className="h-10 px-5 text-white transition-colors duration-150 bg-indigo-600 focus:shadow-outline" onClick={() => setPage(index)}>{index}</button></li>
                    })}
                    <li><button className={loading? "invisible" : "h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-indigo-100"} onClick={() => setPage((page) => page + 1)}>Next</button></li>
                  </ul>
                </nav>

                {sortedResources.map((resource) => (
                  <li key={resource.resourceId} className="pl-6 ml-6 mt-6 pt-6">
                    <Resource id={resource.resourceId} contract={contract}{...resource}  currentUser={currentUser}/>
                  </li>
                ))}

              </ul>
            </TabPanel>
            <TabPanel>
            <ul>
              <div className="flex">
                Current Page: {page}
              </div>
              <nav aria-label="Page navigation">
                  <ul className="inline-flex">
                    <li><button className={page === 1? "invisible" :"h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-l-lg focus:shadow-outline hover:bg-indigo-100"} onClick={() => setPage((page) => page - 1)}>Prev</button></li>
                    {totalPageCount.map((index) => {
                      return <li><button key={index} className="h-10 px-5 text-white transition-colors duration-150 bg-indigo-600 focus:shadow-outline" onClick={() => setPage(index)}>{index}</button></li>
                    })}
                    <li><button className={loading? "invisible" : "h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-indigo-100"} onClick={() => setPage((page) => page + 1)}>Next</button></li>
                  </ul>
                </nav>

                {filteredResources.map((resource) => (
                  <li key={resource.resourceId} className="pl-6 ml-6 mt-6 pt-6">
                    <Resource id={resource.resourceId} contract={contract}{...resource}  currentUser={currentUser}/>
                  </li>
                ))}

              </ul>
            </TabPanel>
          </Tabs>
        </div>
        <div >
          <span className="text-gray-700">Categories</span>
          <div className="mt-2">
          {categories.map((category, index) => {
            return <div>
              <label id = {category.category_id} key={category.category_id} className="inline-flex items-center">
                <input id = {category.category_id} key={category.category_id} type="checkbox" className="form-checkbox" checked={checkedState[index]} onChange={filter} value={category.category_title}/>
                <span className="ml-2">{category.category_title}</span>
              </label>
            </div>
          })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResourceList;