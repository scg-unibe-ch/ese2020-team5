# ese2020-team5

## About
This project contains an Angular frontend and an NodeJs backend which uses Express as a framework. The website displays a web shop. A customer is able to register and afterwards login into his user account. 
A logged in user is then able to create new products / services for other users to purchase or lent. 
In addition, users can add pictures to their products and also create reviews on other users products.
 
## Prerequisite
First of all you have to install [NodeJs](https://nodejs.org/de/download/), which comes per default with the packet manager [npm](https://www.npmjs.com/get-npm).
To verify the installation worked, type `npm -v` and `node -v` in your favourite command line interface (cli). If a version number appears and no error message appears the installation was successful.

## Start / Testing
Follow the README in the frontend folder and backend folder respectively.<br>

### Default Users
At the start of the backend, the following users gets created:
username    |   email           |   password     |   Admin
------------|-------------------|----------------|------------
admin       |admin@example.com  | notSecure12    | yes
user        |user@example.com   | notSecure12    | no


## Technologies 
The image below gives you an overview on the different technologies used. You can find informations about them by consulting the [reading list](https://github.com/scg-unibe-ch/ese2020/wiki/Reading-list). It shows a request the frontend makes to the backend.

![image overview](./backend/src/public/images/tech_overview.png)
