import { Optional, Model, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, DataTypes, Sequelize, Association } from 'sequelize';
import { Product } from './product.model';
import { User } from './user.model';

export interface ReviewAttributes {
    reviewId: number;
    review: string;
    productId: number;
    userId: number;
}

export interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'reviewId'> { }

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {

    public static associations: {
        reviewItems: Association<Product, Review>;
    };
    reviewId!: number;
    review!: string;
    productId!: number;
    userId!: number;

    public static initialize(sequelize: Sequelize) {
        Review.init(
            {
                reviewId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                review: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            { tableName: 'reviews', sequelize }
        );
    }
    public static createAssociations() {
        Review.belongsTo(Product, {
            targetKey: 'productId',
            as: 'product',
            onDelete: 'cascade',
            foreignKey: 'productId'
        }),

        Review.belongsTo(User, {
            as: 'user',
            onDelete: 'SET NULL',
            foreignKey: 'userId'
        });
    }
}
