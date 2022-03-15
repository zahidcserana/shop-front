import { ResetPasswordModel } from './../models/user.model';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ScriptLoaderService } from 'src/app/common/script-loader.service';
import { HomeService } from '../services/home.service';
import { UserInfoModel, UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import * as $ from 'jquery';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MustMatch } from '../../common/must-match.validator';
import { ModalService } from 'src/app/common/_modal';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  resetPassword = false;

  userList: any[] = [];
  sub: Subscription;
  companyList: any[] = [];
  user_id: number;
  userInfo: UserInfoModel = new UserInfoModel();
  user: UserModel = new UserModel();
  userPassword: ResetPasswordModel = new ResetPasswordModel();
  constructor(
    private route: ActivatedRoute,
    private _script: ScriptLoaderService,
    private service: HomeService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
  ) {
  }

  ngOnInit() {
    this.sub = this.route.data.subscribe(
      val => {
        this.userList = val && val['users'] ? val['users'] : [];
      }
    );


    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      user_type: ['ADMIN', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

  }

  get f() { return this.registerForm.controls; }

  openModal(modal: string) {
    $('#print-div').show();
    this.modalService.open(modal);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

  delete(user) {
    this.userService
      .deleteUser(user.id)
      .subscribe(res => {
        if (res.status === true) {
          this.userList = res.data;
          Swal.fire({
            position: "center",
            type: "success",
            title: "Done",
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
  }

  submit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.userService.addUser(this.registerForm.value).then(
      res => {
        if (res.success === true) {
          $('#myForm').trigger('reset');
          Swal.fire({
            position: "center",
            type: "success",
            title: "User successfully added.",
            showConfirmButton: false,
            timer: 1500
          });

          this.userList = res.data;
        } else {
          Swal.fire({
            type: "warning",
            title: res.error,
            text: "Please select a company."
          });
        }
      }
    ).catch(
      err => {
        Swal.fire({
          type: "warning",
          title: "Oops...",
          text: "Something went wrong!"
        });
      }
    );
  }

  editUser(user) {
    this.userInfo.name = user.name;
    this.userInfo.email = user.email;
    this.userInfo.user_type = user.user_type;
    this.userInfo.user_status = user.user_status;
    this.user_id = user.id;
  }

  passwordChange(user) {
    this.resetPassword = true;
    this.userPassword.user = user.id;
  }
  closePasswordForm() {
    $('#resetPassword').trigger('reset');
    this.resetPassword = false;
  }
  changePassword() {
    console.log(this.userPassword);
    this.userService.changePassword(this.userPassword).then(
      res => {
        if (res.success === true) {
          $('#resetPassword').trigger('reset');
          this.resetPassword = false;
          Swal.fire({
            position: "center",
            type: "success",
            title: "Password successfully updated.",
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            type: "warning",
            title: res.error,
            text: "Something went wrong!"
          });
        }
      }
    ).catch(
      err => {
        Swal.fire({
          type: "warning",
          title: "Oops...",
          text: "Something went wrong!"
        });
      }
    );
  }
  closeForm() {
    $('#myForm').trigger('reset');
    this.user_id = null;
  }
  update() {
    this.userService.editUser(this.user_id, this.userInfo).then(
      res => {
        if (res.success === true) {
          $('#myForm').trigger('reset');
          this.user_id = null;
          Swal.fire({
            position: "center",
            type: "success",
            title: "User successfully updated.",
            showConfirmButton: false,
            timer: 1500
          });

          this.userList = res.data;
        } else {
          Swal.fire({
            type: "warning",
            title: res.error,
            text: "Something went wrong!"
          });
        }
      }
    ).catch(
      err => {
        Swal.fire({
          type: "warning",
          title: "Oops...",
          text: "Something went wrong!"
        });
      }
    );
  }

  trackList(index, pro) {
    return pro ? pro.id : null;
  }
}
