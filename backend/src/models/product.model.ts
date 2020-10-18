import { Optional, Model, Sequelize, DataTypes } from 'sequelize';

export interface ProductAttributes {
    productId: number;
    title: string;
    type: number;
    description: string;
    location: string;
    sellOrLend: number;
    price: number;
    priceKind: string;
    status: number;
    deliverable: number;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'productId'> { }

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    productId!: number;
    title!: string;
    type!: number;
    description!: string;
    location: string;
    sellOrLend!: number;
    price!: number;
    priceKind!: string;
    status!: number;
    deliverable!: number;

    public static initialize(sequelize: Sequelize) {
        Product.init({
                productId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                type: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                location: {
                    type: DataTypes.STRING
                },
                sellOrLend: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                price: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                priceKind: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                status: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                deliverable: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            {
                sequelize,
                tableName: 'products'
            }
        );
    }
}
