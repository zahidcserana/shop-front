import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ScriptLoaderService } from 'src/app/common/script-loader.service';
import { AlertService } from 'src/app/common/modules/alert/alert.service';
import { Helpers } from 'src/app/common/helpers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {
    email: '',
    password: ''
  };
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  @ViewChild('hasAlert') alertContainer: ElementRef;

  constructor(private _script: ScriptLoaderService,
    private router: Router,
    private alert: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    // document.getElementById('loader').style.display = 'block';
    // document.getElementById('myDiv').style.display = 'none';
    // $('body').attr('class', 'login-layout light-login');
    this.getSettings();
  }

  ngOnInit() {
    if (this.authService.authenticated) {
      this.router.navigate(['/']);
    }
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() { return this.registerForm.controls; }

  signIn() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }
    $('#spinner-load').css('display', 'block');

    this.loading = true;
    this.authService.login(this.model).subscribe(
      data => {
        if (data.status == '200') {
          let user = data.data;
          this.authService.setUser(user);
          // Helpers.setLoading(true);
          this.loading = false;
          setTimeout(function () {
            $('#spinner-load').css('display', 'block');
          }, 3000);
          localStorage.setItem('isReload', 'true');

          this.router.navigate(['/']);
        } else {
          console.log(data);
          this.alert.error(this.alertContainer, data.error, true, 5000);
          this.loading = false;
        }
      },
      error => {
        $('#spinner-load').css('display', 'none');

        console.log(error.error);
        $('custom-alert').css('display', 'block');
        this.alert.error(
          this.alertContainer,
          this.authService.getErrorMessage(error),
          true,
          5000
        );
        this.loading = false;
      }
    );
  }

  getSettings() {
    // Helpers.loadStyles('head', 'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css');
    // Helpers.loadStyles('head', 'assets/css/bootstrap.min.css');
    // Helpers.loadStyles('head', 'assets/font-awesome/4.5.0/css/font-awesome.min.css');
    // Helpers.loadStyles('head', 'assets/css/fonts.googleapis.com.css');
    // Helpers.loadStyles('head', 'assets/css/ace.min.css');
    // Helpers.loadStyles('head', 'assets/css/ace-rtl.min.css');

    // this._script.loadScripts('body', [
    //   'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js',
    //   'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js',
    //   'assets/js/jquery-2.1.4.min.js',
    // ])
    //   .then(result => {
    //     // Helpers.setLoading(false);
    //   });
  }
}
