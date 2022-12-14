# ChadBank

## Project Architecture
### Techonologies used:
Front-end of this website is written by React with usage of JavaScript. Most of its components are created by material-ui, but there are some additional ui components too. API calls to the back-end are handled by redux toolkit.

![Frontend tech](https://user-images.githubusercontent.com/48299203/202922443-c068ac88-5eb4-4f51-abb7-b711700ca1ad.png)

ChadBank uses Go and web framework Gin for a back-end server. Also there is a go-cron for time-based operations, jwt and google auth for authorization logic and PostgreSQL as database provider.

![Backend tech](https://user-images.githubusercontent.com/48299203/202922465-ccbbacbf-651e-4669-8aae-17ce0e3e9a7c.png)


### Architecture overview
Api is a Monolith based on SQRS pattern.

![Diagram](https://user-images.githubusercontent.com/48299203/202922526-cd6e9de1-2196-4a42-9ebc-8dc7e342abba.png)


ER diagram

![ER](https://user-images.githubusercontent.com/48299203/202922549-ac11e9e6-95bf-491b-a53d-3bf33a4a43f3.png)


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

## Non-Functional Requirements
* Should use Google Authentication
* Password should be minimum of length of 8 characters and have at least one alphanumerical character and one special character
* The app should be single-page
* App should be available for all popular browsers (Chrome, Edge, Safari, Firefox, Internet Explorer)
* Availablity has to be 99.9%
* Disallow transactions that exceed account funds
* Application should be able to handle 10,000 concurrent users


## Use case diagram

![Use case](https://user-images.githubusercontent.com/48299203/202923481-1bb5056a-c310-4bbc-8f8b-ea7eb5ba0c39.png)



## Mockups
Login page

![Login](https://user-images.githubusercontent.com/48299203/202922088-8f292fdd-6df3-4f1c-bf43-2ea6eee713a2.png)


Signup page

![Signup](https://user-images.githubusercontent.com/48299203/202922163-b0d0fe40-e2d0-4151-a95e-9aa826b63a85.png)


Users cards

![Cards](https://user-images.githubusercontent.com/48299203/202922193-a8617f9f-66b8-4444-ba6c-406723c9b58c.png)


Card Info

![Card Info](https://user-images.githubusercontent.com/48299203/202922209-7d1805ce-e801-4ae5-84e4-bbc76a96ad48.png)


Transaction page

![Transaction](https://user-images.githubusercontent.com/48299203/202922258-e2840abd-db33-4e30-90d2-4f300a9f02b7.png)


Create deposit page

![Create deposit](https://user-images.githubusercontent.com/48299203/202922282-3b9fbdb5-95a7-456a-8e0d-576923e04609.png)


Deposit calculator page

![Deposit calculator](https://user-images.githubusercontent.com/48299203/202922318-7390a123-7513-42b4-b54b-c38a25a99f23.png)


Bank accounts page

![Bank accounts](https://user-images.githubusercontent.com/48299203/202922355-33d1c2da-2060-4550-978b-82f478f24936.png)
