import { Context, logging, u128} from "near-sdk-core"
import { Resource, Donation, Category, resources, donations, urls, categories} from "./models"
import { PAGE_SIZE } from "../../utils"

// ____________________________________________________
// ___________________ add resource ___________________
// ____________________________________________________
export function addResource(title: string, url: string, category: string): void {
  // url, title. category can't be empty
  assert(isEmptyString(title), "title can't be empty")
  assert(isEmptyString(category), "category can't be empty")
  assert(isEmptyString(url), "URL can't be empty")
  // url has to be valid
  assert(isValidURL(url), "URL is not valid, must start with valid https://")
  assert(!urls.has(url), "URL already exists")
  
  const existingCategories = getCategories()

  if (existingCategories.indexOf(category)) {
    const newCategory = new Category()
    newCategory.category_title = category
    categories.push(newCategory)
  }

  // create new Resource
  const resource = new Resource(title, url, category)

  // save the resource to storage
  resources.push(resource)
  // add url to urls
  urls.add(url)

  logging.log('resource created')
  logging.log(resource)
}

// ___________________________________________________
// __________________ get resources __________________
// ___________________________________________________
/**
 * 
 * @returns resources
 */
export function getResources(): Resource[] {
  const numResources = min(PAGE_SIZE, resources.length);
  const startIndex = resources.length - numResources;
  const result = new Array<Resource>(numResources);

  for(let i = 0; i < numResources; i++) {
    result[i] = resources[i + startIndex];
  }

  return result;
}

// ___________________________________________________
// __________________ get categories __________________
// ___________________________________________________
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

// ____________________________________________________
// ______________ add vote to a resource ______________
// ____________________________________________________
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

// ________________________________________________________
// ______________ add donation to a resource ______________
// ________________________________________________________
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

// ______________________________________________________________
// ______________ get donation count of a resource ______________
// ______________________________________________________________
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

function isEmptyString(strValue: string): bool{
  return (!!strValue)
}