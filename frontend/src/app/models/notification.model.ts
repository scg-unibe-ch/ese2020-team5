export class Notification {
  constructor(
    public notificationId: number,
    public userId: number,
    public text: string,
    public read: number,
    public createdAt: string
  ) { }
}
