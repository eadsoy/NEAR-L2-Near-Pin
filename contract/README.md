# NEAR Pin

Add useful resources to NEAR Pin, share knowledge with the NEAR community.

----

## Install dependencies
```
yarn
```

## Build and Deploy the contract
```
yarn build:release
near dev-deploy ./build/release/resources.wasm
```

## Add a Resource
**Add a resource**

`addResource(): void`

```sh
near call $CONTRACT addResource '{"title":"res-0","url":"https://url-0.com","category":["new category-0", "new category-1"]}' --accountId your-account-id.testnet
```

**View all resources**

```sh
near view $CONTRACT getResources --accountId your-account-id.testnet
```
**View all categories**
```sh
near view $CONTRACT getCategories --accountId your-account-id.testnet
```
**Upvote a resource**
`addVote(): void`

```sh
near call $CONTRACT addVote '{"resourceId": 0}' --accountId your-account-id.testnet

```
**Donate to a resource creator and say thanks**
`addDonation(): void`

```sh
near call $CONTRACT addDonation '{"resourceId": 0}' --accountId your-account-id.testnet --amount 2
```
## Run Tests
```
yarn test
```
