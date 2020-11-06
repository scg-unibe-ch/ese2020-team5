import { Optional, Model, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, DataTypes, Sequelize, Association } from 'sequelize';
import { User } from './user.model';

export interface TransactionAttributes {
    transactionId: number;
    buyerId: number;
    sellerId: number;
    price: number;
    amount: number;
    productName: string;
}

export interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'transactionId'> { }

export class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {

    transactionId!: number;
    buyerId!: number;
    sellerId!: number;
    price!: number;
    amount: number;
    productName: string;

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
                price: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                amount: {
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
    }
}
