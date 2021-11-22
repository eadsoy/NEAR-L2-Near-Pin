import { Resource, Donation, resources, donations, categories } from "../assembly/models";
import { addResource, getResources, addVote, addDonation, getCategories } from "../assembly/index"
import { Context, u128 } from 'near-sdk-core';
import { VMContext } from "near-mock-vm";

const firstMockAccount = "firstmockaccount.testnet"
const secondMockAccount = "secondmockaccount2.testnet"

let resource: Resource;
let donation: Donation;

let title = "Resource-0"
let url = "https://www.great-resource.com"
let category = "Category-0"


describe("Resource Tests", () => {
  beforeEach(() => {
    VMContext.setSigner_account_id(firstMockAccount)
    VMContext.setPredecessor_account_id(firstMockAccount)
    resource = new Resource(title, url, category)
  })

  // Should create resource
  it('adds a resource', () => {
    addResource(title, url, category);

    expect(resources.length).toBe(
      1,
      'should only contain one resource'
    );
    expect(resources[0]).toStrictEqual(
      resource,
      'resource should have title: "Resource-0", url: "https://www.test-ressource.com", category: "Category-0"'
    );
  });

  // Should be able to create more than one resource with same account
  it('account can create more than one resource', () => {
    // create first reesource
    addResource(title, url, category);

    // create another resource with same account
    title = "Resource-1"
    let anotherUrl = "https://www.another-url.com"

    addResource(title, anotherUrl, category);

    expect(resources.length).toBe(
      2,
      'should contain two resources'
    );
  });

  // Should retrieve all resources
  it('retrieves resources', () => {
    addResource(title, url, category);
    const resourcesArr = getResources();
    expect(resourcesArr.length).toBe(
      1,
      'should be one resource'
    );
    expect(resourcesArr).toIncludeEqual(
      resource,
      'resources should include:\n' + resource.toJSON()
    );
  });

  it('only show the last 10 resources', ()  => {
    addResource(title, url, category);

    const newResources: Resource[] = [];

    for(let i: i32 = 0; i < 10; i++) {
      const url = 'https://www.someurl' + i.toString() + '.com';
      const title = 'res-' + i.toString();
      const category = 'test category'

      newResources.push(new Resource(title, url, category));

      addResource(title, url, category);
    }

    const resources = getResources();

    log(resources.slice(7, 10));
    
    expect(resources).toStrictEqual(
      newResources,
      'should be the last ten resources'
    );
    expect(resources).not.toIncludeEqual(
      resource,
      'shouldn\'t contain the first element'
    );
  });
  
  // If eciistitng category provided, shouldn't create new Category
  // and shouldn't add it to categories.
  it('does not create new category if category already exists', () => {
    // create first reesource
    addResource(title, url, category);

    // create another resource with same account
    title = "Resource-2"
    let anotherUrl = "https://www.anotherurl.com"
    addResource(title, anotherUrl, category);

    log(categories)
    log(getCategories())

    expect(categories.length).toBe(
      1,
      'should contain one category, no duplicates'
    );
    expect(categories[0].category_title).toStrictEqual(
      category,
      'category should have title: "some other category"'
    );
  });

  // If existing category provided, shouldn't create new Category
  // and shouldn't add it to categories.
  it('creates new category if category does not exist', () => {
    // create first reesource
    addResource(title, url, category);
    // create another resource with same account, 
    // different category and url
    title = "res-1"
    let anotherUrl = "https://www.anotherurl.com"
    let anotherCategory = "Some other Category"

    addResource(title, anotherUrl, anotherCategory);

    expect(categories.length).toBe(
      2,
      'should contain two categories'
    );
    expect(categories[1].category_title).toStrictEqual(
      anotherCategory,
      'category should have title: "some other category"'
    );
  });

  // Should allow voting for a resource only once
  itThrows('voter can only vote a for a resource once', () => {
    addResource(title, url, category);

    VMContext.setSigner_account_id(secondMockAccount)
    VMContext.setPredecessor_account_id(secondMockAccount)
    addVote(0);
    addVote(0)
  });

  // Shouldn't allow voting for own resource
  itThrows('cannot vote own resource', () => {
    addResource(title, url, category);
    addVote(0);
  });

  // Shouldn't allow invalid resourceId
  itThrows('resourceId must be valid', () => {
    addResource(title, url, category);
    addVote(1);
  });
  
  //Shouldn't allow invalid url 
  itThrows('URL must start with https://', () => {
    let invalidUrl = "http://www.test-resource.com"
    addResource(title, invalidUrl, category);
  });

  // Shouldn't allow adding resource if 
  // resource with same URL already exists.
  itThrows('URL already exists and was created byy another account', () => {
    addResource(title, url, category);

    VMContext.setSigner_account_id(secondMockAccount)
    VMContext.setPredecessor_account_id(secondMockAccount)
    
    addResource(title, url, category);
  });

  // Shouldn't allow adding resource if 
  // resource with same URL already exists.
  itThrows('URL already exists and was added by current account', () => {
    addResource(title, url, category);
    // only asserts URL; category and titles can be the same
    // try creating another resource with same URL
    addResource(title, url, category);
  });
})

describe('Donation Tests', () => {
  beforeEach(() => {
    VMContext.setSigner_account_id(firstMockAccount)
    VMContext.setPredecessor_account_id(firstMockAccount)

    VMContext.setAttached_deposit(u128.fromString('0'));
    VMContext.setAccount_balance(u128.fromString('0'));
    resource = new Resource(title, url, category)
  });

  it('attaches a deposit to a contract call', () => {
    log('Initial account balance of ' + Context.predecessor + ': ' + Context.accountBalance.toString());

    addResource(title, url, category);

    log('Initial resource total donations: ' + resources[0].total_donations.toString())

    VMContext.setSigner_account_id(secondMockAccount)
    VMContext.setPredecessor_account_id(secondMockAccount)
    VMContext.setAttached_deposit(u128.fromString('10000000000000000000000'));

    addDonation(0);
    donation = new Donation()

    log('Donation made by ' + Context.predecessor + ':\n' + donation.toJSON())
    log('Resource total donations after donation: ' + resources[0].total_donations.toString())
    

    VMContext.setSigner_account_id(firstMockAccount)
    VMContext.setPredecessor_account_id(firstMockAccount)

    log('Received: 10000000000000000000000');
    log('Account balance of account ' +  Context.predecessor + ' after deposit: ' + Context.accountBalance.toString());

    expect(donations.length).toBe(
      1,
      'should only contain one donation'
    );
    expect(donations[0]).toStrictEqual(
      donation,
      'donation should exist'
    );

    expect(resources[0].total_donations).toStrictEqual(
      donation.amount,
      'resource total donations should increase by donation amount'
    );

    expect(Context.accountBalance.toString()).toStrictEqual(
      '10000000000000000000000',
      'receiving account balance should be 10000000000000000000000'
    );
  });

  itThrows('resourceId must be valid',  () => {
    addResource(title, url, category);

    VMContext.setSigner_account_id(secondMockAccount)
    VMContext.setPredecessor_account_id(secondMockAccount)
    VMContext.setAttached_deposit(u128.fromString('10000000000000000000000'));

    addDonation(1);
    donation = new Donation()
  })
});