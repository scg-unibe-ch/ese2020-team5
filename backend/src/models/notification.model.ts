import {
    Model,
    DataTypes,
    Sequelize, Optional
} from 'sequelize';
import {User} from './user.model';

export interface NotificationAttributes {
    notificationId: number;
    userId: number;
    text: string;
    read: number; // read == 0: Not yet read, read == 1: notification read
}

export interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'notificationId'> { }

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {

    notificationId!: number;
    userId!: number;
    text!: string;
    read!: number;

    public static initialize(sequelize: Sequelize) {
        Notification.init(
            {
                notificationId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
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
