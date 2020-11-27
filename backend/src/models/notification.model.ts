import {
    Model,
    DataTypes,
    Sequelize
} from 'sequelize';
import { User } from './user.model';

export interface NotificationAttributes {
    userId: number;
    text: string;
    read: number; // read == 0: Not yet read, read == 1: notification read
}

export class Notification extends Model<NotificationAttributes> implements NotificationAttributes {

    userId!: number;
    text!: string;
    read!: number;

    public static initialize(sequelize: Sequelize) {
        Notification.init(
            {
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                text: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                read: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                }
            },
            { tableName: 'notifications', sequelize }
        );
    }
    public static createAssociations() {
        Notification.belongsTo(User, {
            as: 'user',
            onDelete: 'cascade',
            foreignKey: 'userId'
        });
    }
}
