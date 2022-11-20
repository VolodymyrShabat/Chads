# ChadBank

## Functional Requirements
* Create and manage multiple bank accounts
* Add and manage bank cards
  * Watch transaction history
  * Delete card
  * Block/unblock card
* Create intercard transactions
  * A limit can be set, if said limit is surpassed - additional phone confirmation is required (Google Authenticator)
* Create and manage deposits
  * Select in which account the deposit is to be opened
  * Select deposit type
    * Standard (Max duration: 10 months, Min duration: 4 month, Interest rate: 10%)
    * Fast (Max duration: 6 months, Min duration: 1 month, Interest rate: 6%)
    * Econom (Max duration: 12 months, Min duration: 6 month, Interest rate: 13%)
  * Choose duration of the deposit
  * Select amount to deposit
* Use deposit calculator to see:
  * Profit per month
  * Total amount with profit
  * Amount of pure profit
* Watch bank account activity and transaction history
