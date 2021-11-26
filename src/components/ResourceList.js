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
  //const [tabIndex, setTabIndex] = useState(0);
  

  // const handleSort = () => {
  //   let sortedResources = resources.sort(function compare(a, b){
  //     return b.vote_score - a.vote_score; 
  //   })
  //   setSortedResources(sortedResources)
  //   console.log('here tooo')
  // }

  useEffect(() => {
    let offset; 
    if(page === 1) {
      setPage(1);
      offset = 0;
    } else {
      offset = (page - 1) * PER_PAGE_LIMIT;
    }

    // every second after the component first mounts
    // update the list of resources by invoking the getResources
    // method on the smart contract
    const id = setInterval(() => {
      contract
        .getResourcesByRange({ startIndex: offset, endIndex: offset + PER_PAGE_LIMIT })
        .then((resources) => { setResources(resources); console.log('sth happening')})
    }, 1000);

    const idSorted = setInterval(() => {
      contract
        .sortByVoteCount()
        .then((resources) => { 
          let sortedResources = resources.slice(offset, offset + PER_PAGE_LIMIT)
          setSortedResources(sortedResources); 
          console.log('sth sorted', sortedResources)})
    }, 1000);
    
    return () => {clearInterval(id);clearInterval(idSorted)}
  }, [page, contract]);

  return (
    <>
      <Tabs defaultIndex={0} onSelect={() => setPage(1)}>
        <TabList>
          <Tab>Recent</Tab>
          <Tab>Popular</Tab>
        </TabList>
        <TabPanel>
          <ul>
            {resources.map((resource, index) => (
              <li key={index} className="pl-6 ml-6 mt-6 pt-6">
                <Resource id={index} contract={contract} {...resource} currentUser={currentUser}/>
              </li>
            )).reverse()}

            <div className="flex">
              Current Page: {page}
            </div>
            
            <button onClick={() => setPage((page) => page - 1)}>&lt;</button>
            {" "}
            <button onClick={() => setPage((page) => page + 1)}>&gt;</button>
          </ul>
        </TabPanel>
        <TabPanel>
        <ul>
            {sortedResources.map((resource, index) => (
              <li key={index} className="pl-6 ml-6 mt-6 pt-6">
                <Resource id={index} contract={contract} {...resource} currentUser={currentUser}/>
              </li>
            ))}

            <div className="flex">
              Current Page: {page}
            </div>

            <button onClick={() => setPage((page) => page - 1)}>down</button>
            {" "}
            <button onClick={() => setPage((page) => page + 1)}>up</button>
          </ul>
        </TabPanel>
      </Tabs>
    </>
  );
}

export default ResourceList;