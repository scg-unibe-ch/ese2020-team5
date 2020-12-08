# Frontend

## Prerequisite
You should have installed [NodeJS and npm](https://nodejs.org/en/download/) (they come as one) in order to run the application.  
Make sure the backend is running according to its [README](https://github.com/scg-unibe-ch/ese2020-project-scaffolding/blob/master/backend/README.md).

## Start
- navigate to the frontend folder `cd ese2020-project-scaffolding/frontend` within the same repo where you set up the backend
- run `npm install`
- run `npm run dev`
- open your browser with the url [http://localhost:4200](http://localhost:4200/)

**If you encounter CORS errors within your browser, add the [Allow CORS](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en) extension (version for Google Chrome) to your browser.**

## About
We provide two default logins for testing, representing the two access levels:

### Admin:
````
Username: admin
Password: notSecure12
````
The Admin has access to additional pages and has additional priviledges that the user does not have.

### User:
````
Username: user
Password: notSecure12
````
As a general user, this login can browse the catalog, create/edit/submit their own product listings, save products in their wishlist, write reviews on previously bought/lent products, add products to their shopping cart and purchase these. 

## Features explained

### Admin Panels:
Only the admin has access to this section of the website. This is where the admin manages the site's users and products. The admin-user-panel allows the admin to view all registered users and delete the ones violating the websites guidelines. The admin-product-panel allows the admin to approve and delete products submitted as new product listings by the sellers. It is also possible to see previously approved listings and delete them at any time.

### Catalog and Views:
This is the main view of the website where the user can browse all the products. Only Products which have been approved by the admin are added to the catalog. The catalog can be searched using the search field in the navigation bar. Products can be filtered by type (All, Items or Services), by price range, sales type (sell or lend), location, status and delivery. Furthermore, products can be sorted by recommended, rating or total reviews. Products can be displayed in two views: compact-product-card and compact-product-list. Product images have a orange circle in the upper left corner. This circle indicates if the product is deliverable (left half filled), available (right half) or both (full circle filled). 

### Reviews:
The Product pages contain a review section below the images and description. A seller's average rating, as well as the product's average rating in stars is also displayed for the potential buyer. Reviews can only be written by users who have purchased/lent the item or service in the past. A user can edit the reviews they have written/scored, but only the Admin can delete reviews written by someone else. 

### Wishlist:
Products can be added to the wishlist from the product page. In the wishlist page, users can delete the item from their wishlist or add them to the shopping cart. Unavailable products can always be added to the wishlist for a future purchase. Only Products which are currently available can be added to the shopping cart.

### Notifications:
After a successful purchase, the buyer will reveive a notification in their inbox, listing the purchase details. The seller will also get a notification for each purchase, listing the order details and the buyer shipping details. In addition to the websites inbox, the notifications will also be sent as an email.


## **[models](./src/app/models)**  
  Defined models for user, product, productImage, cartItem, review and notification
## **[services](./src/app/services)**  
  Defined services for auth, user, product, image, cart, review, preference and notification

## Resources
- [Angular](https://angular.io/)  
  Frontend Framework 
- [Angular Material](https://material.angular.io/)  
  Material Design Components
