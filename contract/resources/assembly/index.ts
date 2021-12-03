import { Context, logging, PromiseStatus, u128} from "near-sdk-core"
import { Resource, Donation, Category, resources, donations, urls, categories} from "./models"
import { PAGE_SIZE } from "../utils"

// ____________________________________________________
// ___________________ add resource ___________________
// ____________________________________________________
/**
 * 
 * @param title 
 * @param url 
 * @param category 
 */
export function addResource(title: string, url: string, category: string[]): void {
  // url, title, category can't be empty
  assert(isEmptyString(url), "URL can't be empty")
  assert(isEmptyString(title), "title can't be empty")
  assert(category.length != 0, "at least one category required")
  // category array can't be longer than 3
  assert(category.length <= 3, "category array can't be longer than 3")
  // url must be valid
  assert(isValidURL(url), "URL is not valid, must start with valid https://")
  assert(!urls.has(url), "URL already exists")
  
  // fetch existing categories
  const existingCategories = getCategories()
  // get cataegory array input length
  const inputCategoriesLength = category.length

  // iterate over category array
  // and check whether each item in category array
  // exists in existingCategories array. 
  for(let i = 0; i < inputCategoriesLength; i++) {
    // if category item doesn't exist, create new one
    // and add to categories
    if (!existingCategories.includes(category[i])) {
    const newCategory = new Category()
    newCategory.category_title = category[i]
    categories.push(newCategory)
   }
  }

  // create new Resource
  const resource = new Resource(title, url, category)
  resource.resourceId = resources.length
  // save the resource to storage
  resources.push(resource)
  // add url to urls
  urls.add(url)

  logging.log('resource created')
  logging.log(resource)
}

// ___________________________________________________
// __________________ get all resources __________________
// ___________________________________________________
/**
 * 
 * @returns all resources
 */
export function getResources(): Resource[] {
  const numResources = resources.length;
  const result = new Array<Resource>(numResources);

  for(let i = 0; i < numResources; i++) {
    result[i] = resources[i];
  }

  return result;
}


// ____________________________________________________
// ______________ get resources by range ______________
// ____________________________________________________
/**
 * 
 * @param count 
 * @returns last count * resources
 */
export function getResourcesByRange(startIndex: i32, endIndex: i32): Resource[] {
  if (endIndex > resources.length) {
    endIndex = resources.length
  }
  let range = endIndex - startIndex
  const numResourcesInRange = min(range, resources.length);
  //const startIndex = resources.length - n;
  const result = new Array<Resource>();

  for (let i = 0; i < numResourcesInRange; i++) {
    if(startIndex < 0) {
      if(-startIndex > resources.length) {
        startIndex = 0
      } else {
        startIndex = resources.length + startIndex
      }
    }
    result[i] = resources[i + startIndex];
  }
  
  return result;
}

// __________________________________________________
// _______________ get resource count _______________
// __________________________________________________
/**
 * 
 * @returns resources.length
 */
export function getResourceCount(): i32 {
  return resources.length
}


// _________________________________________________
// __________ get resources by vote count __________
// _________________________________________________
export function sortByVoteCount(): Resource[] {
  const resourcesArr  = getResources()
  let sortedResources = resourcesArr.sort(function compare(a: Resource, b: Resource): i32{
    return b.vote_score - a.vote_score; 
  })
  return sortedResources
}


// __________________________________________________
// _________________ get categories _________________
// __________________________________________________
/**
 * 
 * @returns categories
 */
export function getCategories(): string[] {
  const numCategories = categories.length;
  const result = new Array<string>(numCategories);

  for(let i = 0; i < numCategories; i++) {
    result[i] = categories[i].category_title;
  }

  return result;
}

// __________________________________________________
// _____________ add vote to a resource _____________
// __________________________________________________
/**
 * 
 * @param resourceId 
 */
export function addVote(resourceId: i32 ): void {
  // assert resourceId
  assert(resourceId >= 0, "resourceId must be bigger than 0");
  assert(resourceId < resources.length, "resourceId must be valid");

  // get resource with resourceId
  const resource = resources[resourceId];
  // get voter 
  const voter = Context.predecessor

  // voter cannot vote for their own resources 
  assert(!resource.creator.includes(voter), "Cannot vote own resource!")
  // voter cannot vote twice for same resource
  assert(!resource.votes.has(voter), "Voter has already voted!")

  // increment vote_score by 1
  resource.vote_score = resource.vote_score + 1
  // add voter to votes
  resource.votes.add(voter);
  // update resource in resources
  resources.replace(resourceId, resource);

  logging.log('vote submitted')
  logging.log(resource)
}

// ____________________________________________________
// ____________ add donation to a resource ____________
// ____________________________________________________
/**
 * 
 * @param resourceId 
 */
export function addDonation(resourceId: i32): void {
  assert(resourceId >= 0, "resourceId must be bigger than 0");
  assert(resourceId < resources.length, "resourceId must be valid");

  const resource = resources[resourceId];

  // record the donation
  resource.total_donations = u128.add(resource.total_donations, Context.attachedDeposit);

  // save it back to storage
  resources.replace(resourceId, resource);

  // create new Donation and add to donations
  donations.push(new Donation())

  logging.log('donation sent')
  logging.log(resource)
}

// ____________________________________________________
// _________ get donation count of a resource _________
// ____________________________________________________
/**
 * 
 * @param resourceId 
 * @returns total_donations
 */
export function getDonationsCount(resourceId: i32): u128 {
  const resource = resources[resourceId];
  
  return resource.total_donations
}

// __________________________________________
// ______________ validate url ______________
// __________________________________________
/**
 * 
 * @param url 
 * @returns bool
 */
function isValidURL(url: string): bool {
  return url.startsWith("https://")
}

// __________________________________________
// _________ validate required args _________
// __________________________________________
/**
 * 
 * @param strValue 
 * @returns bool
 */
function isEmptyString(strValue: string): bool{
  return (!!strValue)
}

export function deleteResources(): void {
  while (resources.length !== 0) {
    resources.pop()
  }
}

export function addBookmark(resourceId: i32): void {
  assert(resourceId >= 0, "resourceId must be bigger than 0");
  assert(resourceId < resources.length, "resourceId must be valid");

  const resource = resources[resourceId]

  resource.bookmarked_by.add(Context.predecessor)
  resources.replace(resourceId, resource)

  // voter cannot vote twice for same resource
  assert(!resource.bookmarked_by.has(Context.predecessor), "Already bookmarked!")

  logging.log('resource bookmarked')
  logging.log(resource)
}

export function removeBookmark(resourceId: i32): void {
  assert(resourceId >= 0, "resourceId must be bigger than 0");
  assert(resourceId < resources.length, "resourceId must be valid");

  const resource = resources[resourceId]

  resource.bookmarked_by.has(Context.predecessor)

  resource.bookmarked_by.delete(Context.predecessor)
  resources.replace(resourceId, resource)
  assert(resource.bookmarked_by.has(Context.predecessor), "Resource wasn't bookmarked before")
  
  logging.log('bookmark removed')
  logging.log(resource)
}