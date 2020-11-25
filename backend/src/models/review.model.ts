import { Optional, Model, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, DataTypes, Sequelize, Association } from 'sequelize';
import { Product } from './product.model';
import { User } from './user.model';

export interface ReviewAttributes {
    reviewId: number;
    review: string;
    productId: number;
    userId: number;
    rating: number;
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
    rating!: number;

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
                },
                rating: {
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

    static createDefaultReview() {
        Review.create({ // Create default product for admin
            review: 'WOW, what a crappy product',
            productId: 2,
            userId: 2,
            rating: 1
        }).then(review => Promise.resolve(review)).catch(err => Promise.reject(err));

        Review.create({ // Create default product for admin
            review: 'It is alright I guess',
            productId: 2,
            userId: 1,
            rating: 2.5
        }).then(review => Promise.resolve(review)).catch(err => Promise.reject(err));
    }
}
