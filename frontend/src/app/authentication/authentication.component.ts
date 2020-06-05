import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  user: any = {};
  emailError: boolean = null;
  passwordError: boolean = null;

  constructor(private router: Router, private toastr: ToastrService, private api: ApiService) {
    if (localStorage.getItem("userToken") == null) {
      this.router.navigate(['/auth']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
  }
  showSuccess(message) {
    this.toastr.success('', message);
  }
  showError(message) {
    this.toastr.error('', message);
  }
  login() {
    console.log(this.user);
    this.api.login(this.user).subscribe((res) => {
      if (res.success) {
        localStorage.setItem("userToken", JSON.stringify(res.token));
        localStorage.setItem("username", JSON.stringify(res.username));
        this.showSuccess('Login Successfully');
        this.router.navigate(['/dashboard']);
      } else {
        this.showError(res.message);
      }
    }, err => {
      this.showError('Network error');
    });
  }
  signup() {
    console.log(this.user);
    this.api.createUser(this.user).subscribe((res) => {
      if (res.success) {
        localStorage.setItem("userToken", JSON.stringify(res.token));
        localStorage.setItem("username", JSON.stringify(res.username));
        this.showSuccess('Registered Successfully');
        this.router.navigate(['/dashboard']);
      } else {
        this.showError(res.message);
      }
    }, err => {
      this.showError('Network error');
    });
  }

}
