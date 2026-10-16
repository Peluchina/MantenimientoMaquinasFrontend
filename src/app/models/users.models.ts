export interface Users{
    userId:number;
    roleId:number;
    username: string;
    firstName: string;
    LastName: string;
    email: string;
    userStatus:string;
    RoleName: string;
    CreatedAt:string;
}
export type UsersRequest = Omit<Users, 'userId'>;