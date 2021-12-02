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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState([])
  const [resourceCount, setResourceCount] = useState(0)
  
  useEffect(() => {
    let offset;
    let sliceOffset;
    if(page === 1) {
      setPage(1);
      if(resourceCount < PER_PAGE_LIMIT) {
        offset = resourceCount;
      } else {
        offset = resourceCount - PER_PAGE_LIMIT;
      }
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

    return () => {
      clearInterval(id);
      clearInterval(idSorted);
      clearInterval(totalResources)
    }
  }, [page, contract, resourceCount]);

  return (
    <>
      <Tabs defaultIndex={0} onSelect={() => setPage(1)}>
        <TabList>
          <Tab>Recent</Tab>
          <Tab>Popular</Tab>
        </TabList>
        <TabPanel>
          <ul>
            <div className="flex">
              Current Page: {page}
            </div>
            <nav aria-label="Page navigation">
              <ul className="inline-flex">
                <li><button className="h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-l-lg focus:shadow-outline hover:bg-indigo-100">Prev</button></li>
                
                {totalPageCount.map((index) => {
                  return <li><button key={index} className="h-10 px-5 text-white transition-colors duration-150 bg-indigo-600 focus:shadow-outline" onClick={() => setPage(index)}>{index}</button></li>
                })}

                <li><button className={loading? "invisible" : "h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-indigo-100"} onClick={() => setPage((page) => page + 1)}>Next</button></li>
              </ul>
            </nav>

            {resources.map((resource) => (
              <li key={resource.resourceId} className="pl-6 ml-6 mt-6 pt-6">
                <Resource id={resource.resourceId} contract={contract}{...resource} currentUser={currentUser}/>
              </li>
            )).reverse()}

          </ul>
        </TabPanel>
        <TabPanel>
        <ul>
          <div className="flex">
            Current Page: {page}
          </div>
          <nav aria-label="Page navigation">
              <ul className="inline-flex">
                <li><button className="h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-l-lg focus:shadow-outline hover:bg-indigo-100" onClick={() => setPage((page) => page - 1)}>Prev</button></li>
                {totalPageCount.map((index) => {
                  return <li><button key={index} className="h-10 px-5 text-white transition-colors duration-150 bg-indigo-600 focus:shadow-outline" onClick={() => setPage(index)}>{index}</button></li>
                })}
                <li><button className={loading? "invisible" : "h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-indigo-100"} onClick={() => setPage((page) => page + 1)}>Next</button></li>
              </ul>
            </nav>

            {sortedResources.map((resource) => (
              <li key={resource.resourceId} className="pl-6 ml-6 mt-6 pt-6">
                <Resource id={resource.resourceId} contract={contract} {...resource} currentUser={currentUser}/>
              </li>
            ))}

          </ul>
        </TabPanel>
      </Tabs>
    </>
  );
}

export default ResourceList;