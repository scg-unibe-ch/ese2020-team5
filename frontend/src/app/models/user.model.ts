export class User {
  constructor(
    public userId: number,
    public userName: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public gender: string,
    public country: string,
    public city: string,
    public zipCode: string,
    public street: string,
    public phoneNr: string,
    public credits: number,
    public isAdmin: boolean
  ) { }
}
