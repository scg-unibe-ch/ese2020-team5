import {
    Optional,
    Model,
    Sequelize,
    DataTypes,
    Association,
    HasManyAddAssociationMixin
} from 'sequelize';
import { Product } from './product.model';
import { Review } from './review.model';
import { Transaction } from './transaction.model';

export interface UserAttributes {
    userId: number;
    userName: string;
    password: string;
    email: string;
    lastName: string;
    firstName: string;
    gender: string;
    country: string;
    city: string;
    zipCode: string;
    phoneNr: string;
    isAdmin: number;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public static associations: {
        products: Association<User, Product>;
        reviews: Association<User, Review>;
        transactions: Association<User, Transaction>
    };

    // public getProducts!: HasManyGetAssociationsMixin<Product>;
    public addProduct!: HasManyAddAssociationMixin<Product, number>;
    // public getTransactions!: HasManyGetAssociationsMixin<Transaction>;
    // public addTransaction: HasManyAddAssociationMixin<Transaction, number>;

    public readonly products?: Product[];

    userId!: number;
    userName!: string;
    password!: string;
    email: string;
    lastName: string;
    firstName: string;
    gender: string;
    country: string;
    city: string;
    zipCode: string;
    phoneNr: string;
    isAdmin: number;

    public static initialize(sequelize: Sequelize) {
        User.init({
            userId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            gender: {
                type: DataTypes.STRING
            },
            country: {
                type: DataTypes.STRING
            },
            city: {
                type: DataTypes.STRING
            },
            zipCode: {
                type: DataTypes.STRING
            },
            phoneNr: {
                type: DataTypes.STRING
            },
            isAdmin: {
                type: DataTypes.INTEGER
            }
        },
            {
                sequelize,
                tableName: 'users'
            }
        );
    }

    public static createAssociations() {
        User.hasMany(Product, {
            as: 'products',
            foreignKey: 'userId'
        });
        User.hasMany(Review, {
            as: 'reviews',
            foreignKey: 'userId'
        });
        User.hasMany(Transaction, {
           as: 'selltransactions',
           foreignKey: 'sellerId'
        });
        User.hasMany(Transaction, {
            as: 'buytransactions',
            foreignKey: 'buyerId'
        });
    }

    public static createDefaultUsers() {
       User.create ({ // Create admin user with username: admin and password: notSecure12
            userName: 'admin',
            password: '$2b$12$Zkd6EiRtkKXtTjn4Xgfnb.cApkCsUL/Si9J46O9PmlTmDf9ofDJsu',
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'istrator',
            gender: 'male',
            country: 'Switzerland',
            city: 'Bern',
            zipCode: '3000',
            phoneNr: '123 123 12 12',
            isAdmin: 1
        }).then(admin => Promise.resolve(admin)).catch(err => Promise.reject(err));

        User.create ({ // Create user with username: user and password: notSecure12
            userName: 'user',
            password: '$2b$12$Zkd6EiRtkKXtTjn4Xgfnb.cApkCsUL/Si9J46O9PmlTmDf9ofDJsu',
            email: 'user@example.com',
            firstName: 'Testing',
            lastName: 'user',
            gender: 'female',
            country: 'Switzerland',
            city: 'Fribourg',
            zipCode: '1700',
            phoneNr: '123 456 78 90',
            isAdmin: 0
        }).then(admin => Promise.resolve(admin)).catch(err => Promise.reject(err));
    }
}
