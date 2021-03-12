export class User {
  email: string;
  unique_name: string;
  token: string;

  constructor(email: string, unique_name: string, token: any) {
    this.email = email;
    this.unique_name = unique_name;
    this.token = token;
  }
}
