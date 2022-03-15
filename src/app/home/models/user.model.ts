export class UserModel {
  name: string;
  email: string;
  user_type = 'SALESMAN';
  user_status = 'ACTIVE';
}

export class UserInfoModel {
  name: string;
  email: string;
  user_type = 'SALESMAN';
  user_status = 'ACTIVE';
}

export class ResetPasswordModel {
  password: string;
  password_confirmation: string;
  user: number;
}

