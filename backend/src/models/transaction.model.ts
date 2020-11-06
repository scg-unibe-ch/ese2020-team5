import { Optional, Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user.model';
import { Product } from './product.model';

export interface TransactionAttributes {
    transactionId: number;
    buyerId: number;
    sellerId: number;
    pricePerUnit: number;
    priceTotal: number;
    amount: number;
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
    amount!: number;
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
                    allowNull: false
                },
                sellerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                pricePerUnit: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                priceTotal: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                amount: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
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
            onDelete: 'SET NULL',
            foreignKey: 'buyerId'
        });
        Transaction.belongsTo(User, {
            as: 'seller',
            onDelete: 'SET NULL',
            foreignKey: 'sellerId'
        });
        Transaction.belongsTo(Product, {
            as: 'product',
            onDelete: 'SET NULL',
            foreignKey: 'productId'
        });
    }
}
