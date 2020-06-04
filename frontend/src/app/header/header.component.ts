import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

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

  logout() {
    localStorage.clear();
    this.showSuccess('Logout Successfully');
    this.router.navigate(['/auth']);
  }

}
