export interface IUser {
  age?: number;
  name: string;
  lastName?: string;
  role?: string;
  address: string;
  img?: string | ArrayBuffer;
  gender?: string;
  phone?: string;
  profileLink?: string;
  social?: IUserLink[];
}

export interface IUserLink {
  icon: string;
  link: string;
}
