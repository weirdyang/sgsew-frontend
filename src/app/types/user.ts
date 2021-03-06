import { IErrorMessage } from './http-error'
export interface Profile {
    username: string;
    following: boolean;
    avatar: string;
}

export interface IUser {
    id: string;
    email: string;
    username: string;
    avatar: string;
    role: string;
}

export interface IUserDisplay {
    _id: string;
    role: string;
    username: string;
    email: string;
    createdAt: string;

}
export interface IUserArray {
    users: IUserDisplay[]
}
export interface ILogin {
    username: string;
    password: string;
}


export class RegisterUser {
    password!: string;
    id!: string;
    username!: string;
    avatar!: string;
    email!: string;
}

export interface IApiResponse {
    message: string;
    additonalInfo: IErrorMessage[];
}