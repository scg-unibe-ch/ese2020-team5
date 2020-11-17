import { Optional, Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user.model';
import { Product } from './product.model';

export interface TransactionAttributes {
    transactionId: number;
    buyerId: number;
    sellerId: number;
    pricePerUnit: number;
    priceTotal: number;
    amountOrTime: number;
    productName: string;
    productId: number;
}

export interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'transactionId'> { }

export class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {

    transactionId!: number;
    buyerId!: number;
    sellerId!: number;
    pricePerUnit!: number;
    priceTotal!: number;
    amountOrTime!: number;
    productName!: string;
    productId!: number;

    public static initialize(sequelize: Sequelize) {
        Transaction.init(
            {
                transactionId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                buyerId: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                sellerId: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                pricePerUnit: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                priceTotal: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                amountOrTime: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                productName: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            { tableName: 'transactions', sequelize }
        );
    }
    public static createAssociations() {
        Transaction.belongsTo(User, {
            as: 'buyer',
            foreignKey: 'buyerId',
            onDelete: 'SET NULL'
        });
        Transaction.belongsTo(User, {
            as: 'seller',
            foreignKey: 'sellerId',
            onDelete: 'SET NULL'
        });
        Transaction.belongsTo(Product, {
            as: 'product',
            foreignKey: 'productId',
            onDelete: 'SET NULL'
        });
    }
}
