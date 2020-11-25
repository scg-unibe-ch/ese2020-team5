import express, { Application , Request, Response } from 'express';
import morgan from 'morgan';
import { TodoItemController } from './controllers/todoitem.controller';
import { TodoListController } from './controllers/todolist.controller';
import { UserController } from './controllers/user.controller';
import { SecuredController } from './controllers/secured.controller';
import { ProductController } from './controllers/product.controller';
import { ReviewController } from './controllers/review.controller';
import { ShoppingCartController} from './controllers/shoppingcart.controller';
import { Sequelize } from 'sequelize';
import { TodoList } from './models/todolist.model';
import { TodoItem } from './models/todoitem.model';
import { User } from './models/user.model';
import { Product } from './models/product.model';
import { Review } from './models/review.model';
import { ProductImage } from './models/productImage.model';
import { Transaction } from './models/transaction.model';
import { ShoppingCart} from './models/shoppingcart.model';

import cors from 'cors';


export class Server {
    private server: Application;
    private sequelize: Sequelize;
    private port = process.env.PORT || 3000;

    constructor() {
        this.server = this.configureServer();
        this.sequelize = this.configureSequelize();

        TodoItem.initialize(this.sequelize); // creates the tables if they dont exist
        TodoList.initialize(this.sequelize);
        TodoItem.createAssociations();
        TodoList.createAssociations();
        User.initialize(this.sequelize);
        Product.initialize(this.sequelize);
        ProductImage.initialize(this.sequelize);
        Review.initialize(this.sequelize);
        Transaction.initialize(this.sequelize);
        ShoppingCart.initialize(this.sequelize);
        Product.createAssociations();
        User.createAssociations();
        Transaction.createAssociations();
        ShoppingCart.createAssociations();

        this.sequelize.sync({force: true}).then(() => {
            User.truncate();
            Product.truncate(); // create connection to the database
            Review.truncate();
            User.createDefaultUsers();                           // create a default admin user and a default normal user
            Product.createDefaultProduct();
            Review.createDefaultReview();
        }).then(() => {
            this.server.listen(this.port, () => {                                   // start server on specified port
                console.log(`server listening at http://localhost:${this.port}`);   // indicate that the server has started
            });
        });
    }

    private configureServer(): Application {
        // options for cors middleware
        const options: cors.CorsOptions = {
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'X-Access-Token',
            ],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: `http://localhost:${this.port}`,
            preflightContinue: false,
        };

        return express()
            .use(cors())
            .use(express.json())                    // parses an incoming json to an object
            .use(morgan('tiny'))                    // logs incoming requests
            .use('/todoitem', TodoItemController)   // any request on this path is forwarded to the TodoItemController
            .use('/todolist', TodoListController)
            .use('/user', UserController)
            .use('/secured', SecuredController)
            .use('/products', ProductController)
            .use('/review', ReviewController)
            .use('/cart', ShoppingCartController)
            .options('*', cors(options))
            .use(express.static('./src/public'))
            // this is the message you get if you open http://localhost:3000/ when the server is running
            .get('/', (req, res) => res.send('<h1>Welcome to the ESE-2020 Backend Scaffolding <span style="font-size:50px">&#127881;</span></h1>'));
    }

    private configureSequelize(): Sequelize {
        return new Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite',
            logging: false // can be set to true for debugging
        });
    }
}

const server = new Server(); // starts the server
