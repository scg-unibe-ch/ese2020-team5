import {
    Model,
    DataTypes,
    Sequelize,
    BelongsToCreateAssociationMixin
} from 'sequelize';
import { User } from './user.model';
import { Product } from './product.model';

export interface WishlistAttributes {
    buyerId: number;
    productId: number;
    amountOrTime: number;
}

export class Wishlist extends Model<WishlistAttributes> implements WishlistAttributes {

    buyerId!: number;
    productId!: number;
    amountOrTime!: number;

    public getProduct!: BelongsToCreateAssociationMixin<Product>;

    public static initialize(sequelize: Sequelize) {
        Wishlist.init(
            {
                buyerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                amountOrTime: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            { tableName: 'wishlist', sequelize }
        );
    }
    public static createAssociations() {
        Wishlist.belongsTo(User, {
            as: 'buyer',
            onDelete: 'cascade',
            foreignKey: 'buyerId'
        });
        Wishlist.belongsTo(Product, {
            as: 'product',
            onDelete: 'CASCADE',
            foreignKey: 'productId'
        });
    }
}
