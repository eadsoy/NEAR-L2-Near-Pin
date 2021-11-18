// src/components/ResourceList.js
import { useEffect, useState } from "react";
import { Resource } from "./Resource";

const PER_PAGE_LIMIT = 10;

const ResourceList = ({ contract }) => {
  const [resources, setResources] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let offset; 
    if(page < 1) {
      setPage(1);
      offset = 0;
    } else {
      offset = (page - 1) * PER_PAGE_LIMIT;
    }

    // every second after the component first mounts
    // update the list of todos by invoking the getResources
    // method on the smart contract
    const id = setInterval(() => {
      
      contract
        .getResources({ offset, limit: PER_PAGE_LIMIT })
        .then((resources) => {console.log(resources);setResources(resources)});
    }, 1000);

    return () => clearInterval(id);
  }, [page, contract]);

  return (
    <ul>
      <div className="flex">
      Current Page: {page}
      </div>
      <button onClick={() => setPage((page) => page - 1)}>&lt;</button>
      {" "}
      <button onClick={() => setPage((page) => page + 1)}>&gt;</button>
      {resources.map((resource) => (
        <li key={resource.created_at}>
          <Resource contract={contract} {...resource} />
        </li>
      ))}
    </ul>
  );
}

export default ResourceList;