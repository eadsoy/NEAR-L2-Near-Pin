#!/usr/bin/env bash

# # exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

# echo
# echo
# echo ---------------------------------------------------------
# echo "Step 1: Call 'view' functions on the contract"
# echo
# echo "(run this script again to see changes made by this file)"
# echo ---------------------------------------------------------
# echo

# near view $CONTRACT helloWorld

# echo
# echo

# near view $CONTRACT read '{"key":"some-key"}'

echo
echo
echo ---------------------------------------------------------
echo "Step 2: Call 'change' functions on the contract"
echo ---------------------------------------------------------
echo

# the following line fails with an error because we can't write to storage without signing the message
# --> FunctionCallError(HostError(ProhibitedInView { method_name: "storage_write" }))
# near view $CONTRACT write '{"key": "some-key", "value":"some value"}'
for i in 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27
do
  near call $CONTRACT addResource '{"title":"'res-$i'","url":"'https://url-$i.com'","category":["'newcategory-$i'", "category-1"]}' --accountId esinadsoy.testnet
done


# near call $CONTRACT addResource '{"title":"res-4","url":"https://url-4.com","category":["new category-0", "new category-1"]}' --accountId esinadsoy.testnet

# near call $CONTRACT addResource '{"title":"res-5","url":"https://url-5.com","category":["new category-0", "new category-1"]}' --accountId esinadsoy.testnet

near view $CONTRACT getResources --accountId esinadsoy.testnet

echo
echo "now run this script again to see changes made by this file"
exit 0
