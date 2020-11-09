import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user.model';
import { Product } from './product.model';

export interface ShoppingCartAttributes {
    buyerId: number;
    productId: number;
}

export class ShoppingCart extends Model<ShoppingCartAttributes> implements ShoppingCartAttributes {

    buyerId!: number;
    productId!: number;

    public static initialize(sequelize: Sequelize) {
        ShoppingCart.init(
            {
                buyerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            { tableName: 'shoppingcart', sequelize }
        );
    }
    public static createAssociations() {
        ShoppingCart.belongsTo(User, {
            as: 'buyer',
            onDelete: 'cascade',
            foreignKey: 'buyerId'
        });
        ShoppingCart.belongsTo(Product, {
            as: 'product',
            onDelete: 'CASCADE',
            foreignKey: 'productId'
        });
    }
}
