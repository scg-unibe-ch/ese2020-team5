# ESE2020 Team 5 Backend

## Prerequisite
You should have installed [NodeJS and npm](https://nodejs.org/en/download/) (they come as one) in order to start the backend server.

## Start
- clone the ese2020-team5 repository
- navigate to the backend folder `cd ese2020-team5/backend`
- run `npm install`
- run `npm run dev`
- open your browser with the url [http://localhost:3000](http://localhost:3000/)

## About

1. The logic is split up:
	- authorizing a request is done via middleware
	- logic e.g. creating/authentication is done via [UserService](./src/services/user.service.ts)
2. The controller itself is structured as a class.

## Tests

Run the postman backend test the following way:

```
npm install newman
npm run dev &
newman run Integration\ Tests.postman_collection.json -e admin.postman_environment.json
newman run Integration\ Tests.postman_collection.json -e User.postman_environment.json
```

or you can import the `Integration\ Tests.posman_collection.json` and the two environment files to postman and run it with the GUI.

## Database Diagram

![database_diagram](../documentation/Database-v2.jpg)

## Endpoints
Some endpoints can be called in a [browser](http://localhost:3000), others have to be called by a REST Client. [Here](./postman_collection) you can find a collection that contains all requests, which you can import into Postman. [Postman](https://www.postman.com/) is a REST Client.

Here are some examples of the endpoints, please refer to the postman collection to see all kind of requests.

### `/products`
- POST

	<details>
		<summary>Request</summary>

	```json
		{
      "title": "string",
      "type": "number",
      "description": "string",
      "location": "string",
      "sellOrLend": "number",
      "price": "number",
      "priceKind": "number",
      "status": "number",
      "deliverable": "number",
      "approved": "number",
      "userId": "number"
		}
	```

	</details>


	<details>
		<summary>Response</summary>

		Code: 200
		Body:

	```json
	{
		"productId": "number",
    "title": "string",
    "type": "number",
    "description": "string",
    "location": "string",
    "sellOrLend": "number",
    "price": "number",
    "priceKind": "number",
    "status": "number",
    "deliverable": "number",
    "approved": "number",
    "userId": "number"
	}
	```
</details>

- PUT `/:id`

	<details>
		<summary>Request</summary>

	```json
		{
      "title": "string",
      "type": "number",
      "description": "string",
      "location": "string",
      "sellOrLend": "number",
      "price": "number",
      "priceKind": "number",
      "status": "number",
      "deliverable": "number",
		}
	```

	</details>


	<details>
		<summary>Response</summary>

		Code: 200
		Body:

	```json
	{
		"productId": "number",
    "title": "string",
    "type": "number",
    "description": "string",
    "location": "string",
    "sellOrLend": "number",
    "price": "number",
    "priceKind": "number",
    "status": "number",
    "deliverable": "number",
    "approved": "number",
    "userId": "number"
	}
	```
</details>

- DELETE `/:id`<br/>
	Response: Status: 200

- GET
	<details>
		<summary>Response</summary>

		Code: 200
		Body:
	```json
	{
		"productId": "number",
    "title": "string",
    "type": "number",
    "description": "string",
    "location": "string",
    "sellOrLend": "number",
    "price": "number",
    "priceKind": "number",
    "status": "number",
    "deliverable": "number",
    "approved": "number",
    "userId": "number",
    "reviews": "Review[]"
	}
	```
	</details>

### `/review`
- POST
	<details>
		<summary>Request</summary>

		Code: 200
		Body:
	```json
	{
    "review": "string",
    "productId": "number"
	}

	```
	</details>

	<details>
		<summary>Response</summary>

		Code: 200
		Body:
	```json
	{
		"reviewId": "number",
    "review": "string",
    "productId": "number",
    "userId": "number"
	}

	```
	</details>

- PUT `/:id`
	<details>
		<summary>Request</summary>

		Code: 200
		Body:
	```json
	{
    "review": "string",
	}

	```
	</details>
	<details>
		<summary>Response</summary>

		Code: 200
		Body:
	```json
	{
		"reviewId": "number",
    "review": "string",
    "productId": "number",
    "userId": "number"
	}

	```
	</details>

- DELETE `/:id`<br>
	Response: Status: 200

- GET
	<details>
		<summary>Response</summary>

		Code: 200
		Body:
	```json
	{
		"todoListId": "number",
		"name":"string",
		"todoItems":"TodoItem[]"
	}
	```
	</details>

### `/user`
- POST `/register`
	<details>
		<summary>Request</summary>

		Code: 200
		Body:
	```json
	{
    "userName": "string",
    "password": "string",
    "email":"string",
    "lastName":"string",
    "firstName":"string",
    "isAdmin": "number"
	}

	```
	</details>
	<details>
		<summary>Response</summary>

		Code: 200
		Body:
	```json
	{
		"userId": "number",
		"userName":"string",
		"password":"string(hashed)"
    "email":"string",
    "lastName":"string",
    "firstName":"string",
    "isAdmin": "number"
	}

	```
	</details>

- POST `/login`
	<details>
		<summary>Request</summary>

		Code: 200
		Body:
	```json
	{
		"userNameOrEmail":"string",
		"password":"string"
	}

	```
	</details>
	<details>
		<summary>Response</summary>

		Code: 200 || 403
		Body:
	```json
	{
		"user": {
			"userId":"string",
			"userName":"string",
			"password":"stirng(hashed)"
      "email":"string",
      "lastName":"string",
      "firstName":"string",
      "isAdmin": "number"
		},
		"token":"string"
	}

	```
	</details>

- GET
	<details>
		<summary>Response</summary>

		Code: 200
		Body:
	```json
	[
		{
			"userId":"string",
			"userName":"string",
			"password":"stirng(hashed)"
      "email":"string",
      "lastName":"string",
      "firstName":"string",
      "isAdmin": "number"
		},
		{
			"userId":"string",
			"userName":"string",
			"password":"stirng(hashed)"
      "email":"string",
      "lastName":"string",
      "firstName":"string",
      "isAdmin": "number"
		},
		...
	]

	```
	</details>
