import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  user: any = {};
  emailError: boolean = null;
  passwordError: boolean = null;

  constructor(private router: Router, private toastr: ToastrService) {
    if (localStorage.getItem("userDetails") == null) {
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
    let userDetails = [{ username: "Venkatesh Mogili" }];
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    // this.showSuccess('Login Successfully');
    this.showError('Wrong credentials');
    // this.router.navigate(['/dashboard']);
  }
  signup() {
    console.log(this.user);
    let userDetails = [{ username: "Venkatesh Mogili" }];
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    // this.showSuccess('Login Successfully');
    this.showError('Wrong credentials');
    // this.router.navigate(['/dashboard']);
  }

}
