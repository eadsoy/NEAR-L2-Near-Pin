import { useState } from 'react';
import Airtable from 'airtable';

const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE_ID);

export default function useData() {
  const [resourceCount, setResourceCount] = useState(0);
  const [urls, setUrls] = useState([])
  const [categoryTitles, setCategoryTitles] = useState([])
  const [categories, setCategories] = useState([])
  const [resourcesFromAirtable, setResourcesFromAirtable] = useState([])
  const getData = async () => {
    base('resources').select({
      view: "All Records"
      }).eachPage(function page(records, fetchNextPage) {
        const urls = []
        const categories = []
        const resources = []

        records.forEach(function(record) {
          urls.push(...record.get('url'));
          categories.push(...record.get('categories'));
          resources.push(record.fields)
        });
        
        fetchNextPage();

        setResourceCount(records.length)
        setUrls(urls)
        setCategoryTitles([...new Set(categories)])
        setResourcesFromAirtable(resources)
      }, function done(err) {
          if (err) { console.error(err); return; }
    });

    base('categories').select({
      view: "All Records"
      }).eachPage(function page(records, fetchNextPage) {
        const categoriesArray = []

        records.forEach(function(record) {
          categoriesArray.push({
            id: record.id, 
            category_id: record.fields.category_id, 
            category_title: record.fields.category_title,
            linked_resources: record.fields.resources
          });
        });

        fetchNextPage();
        
        setCategories(categoriesArray)
      }, function done(err) {
          if (err) { console.error(err); return; }
    });
  }

  const createResource = (data) => {
    return new Promise((resolve, reject) => {
      base('resources').create(data, function(err, record) {
        if (err) {
          console.error(err);
          return reject(err)
        }
        return resolve({
          id: record.getId()
        })
      });
    })
  }

  const createCategory = (data) => {
    return new Promise((resolve, reject) => {
      base('categories').create(data, function(err, record) {
        if (err) {
          console.error(err);
          return reject(err)
        }
        return resolve({
          id: record.getId()
        })
      });
    })
  }

  const createUrl = (data) => {
    return new Promise((resolve, reject) => {
      base('urls').create(data, function(err, record) {
        if (err) {
          console.error(err);
          return reject(err)
        }
        return resolve({
          id: record.getId()
        })
      });
    })
  }

  return {
    getData,
    createCategory,
    createUrl,
    createResource,
    urls,
    categoryTitles,
    categories,
    resourceCount,
    resourcesFromAirtable 
  }
};