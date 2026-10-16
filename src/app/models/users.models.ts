export interface Users {
  userId: number;
  roleId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userStatus: string;
  roleName: string;
  createdAt: string;
}

export interface UsersRequest {
  RoleId: number;
  Username: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
}
