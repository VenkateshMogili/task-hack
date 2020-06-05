import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username: any;
  constructor(private router: Router, private toastr: ToastrService) {
    if (localStorage.getItem("userToken") == null) {
      this.router.navigate(['/auth']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.username = JSON.parse(localStorage.getItem("username"));
  }


  showSuccess(message) {
    this.toastr.success('', message);
  }

  logout() {
    localStorage.clear();
    this.showSuccess('Logout Successfully');
    this.router.navigate(['/auth']);
  }

}
