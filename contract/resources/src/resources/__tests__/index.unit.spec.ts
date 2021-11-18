import { AccountId, PAGE_SIZE } from "../../utils"
import { Resource } from "../assembly/models";

let contract: Resource
let url: string;
let title: string;
let category: string;

beforeEach(() => {
  contract = new Resource(url, title, category)
})

describe("Resource", () => {
  // VIEW method tests

  // it("says hello", () => {
  //   expect(contract.helloWorld()).toStrictEqual("hello world")
  // })

  // it("reads data", () => {
  //   expect(contract.read("some key")).toStrictEqual("🚫 Key [ some key ] not found in storage. ( storage [ 0 bytes ] )")
  // })

  // // CHANGE method tests

  // it("saves data to contract storage", () => {
  //   expect(contract.write("some-key", "some value")).toStrictEqual("✅ Data saved. ( storage [ 18 bytes ] )")
  // })
})
