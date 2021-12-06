import { AccountId, Money, Timestamp } from "../utils";
import { Context, u128, PersistentSet, PersistentVector, PersistentMap } from "near-sdk-core"

@nearBindgen
export class Resource {
  resourceId: i32;
  creator: AccountId = Context.sender;
  created_at: Timestamp = Context.blockTimestamp;
  vote_score: i32 = 0;
  total_donations: u128 = u128.Zero;
  votes: Set<string> = new Set<string>();
  bookmarks: Set<string> = new Set<string>();
  linked_categories: Set<i32> = new Set<i32>();

  constructor(
    public title: string,
    public url: string,
    public category: Array<string>
  ) {}
}

@nearBindgen
export class Category {
  category_id: i32;
  category_title: string;
  linked_resources: Array<i32> = new Array<i32>();
}

@nearBindgen
export class Donation {
  amount: Money = Context.attachedDeposit;
  donor: AccountId = Context.predecessor;
  created_at: Timestamp = Context.blockTimestamp;
}

export const resources = new PersistentVector<Resource>("r")
export const donations = new PersistentVector<Donation>("d");
export const urls = new PersistentSet<String>("u");
export const categories = new PersistentVector<Category>("c");
export const categoriesMap = new PersistentMap<String, Category>("ca")