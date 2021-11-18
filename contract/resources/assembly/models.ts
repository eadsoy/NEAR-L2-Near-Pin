import { AccountId, Money, Timestamp } from "../../utils";
import { Context, u128, PersistentSet, PersistentVector } from "near-sdk-core"
@nearBindgen
export class Resource {
  creator: AccountId = Context.sender;
  created_at: Timestamp = Context.blockTimestamp;
  vote_score: i32 = 0;
  total_donations: u128 = u128.Zero;

  constructor(
    public title: string,
    public url: string,
    public category: string
  ) {}
}

@nearBindgen
export class Vote {
  created_at: Timestamp = Context.blockTimestamp;

  constructor(
    public value: i8,
    public voter: AccountId,
    public resourceId: i32
  ) { }
}

@nearBindgen
export class Donation {
  amount: Money = Context.attachedDeposit;
  donor: AccountId = Context.predecessor;
  created_at: Timestamp = Context.blockTimestamp;
}


// TODO: IMPLEMENT THIS MAYBE? 
// class Vector<T> extends PersistentVector<T> {
//   /**
//    * this method isn't normally available on a PersistentVector
//    * so we add it here to make our lives easier when returning the
//    * last `n` items for comments, votes and donations
//    * @param count
//    */
//   get_last(count: i32): Array<T> {
//     const n = min(count, this.length);
//     const startIndex = this.length - n;
//     const result = new Array<T>();
//     for (let i = startIndex; i < this.length; i++) {
//       const entry = this[i];
//       result.push(entry);
//     }
//     return result;
//   }
// }


export const resources = new PersistentVector<Resource>("r")
export const creators = new PersistentSet<AccountId>("c")
export const votes = new PersistentVector<Vote>("v");
export const voters = new PersistentSet<AccountId>("vs");
export const donations = new PersistentVector<Donation>("d");
//const comments = new PersistentVector<Comment>("c");
