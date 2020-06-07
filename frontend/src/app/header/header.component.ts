import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username: any;
  user: any = {};
  imagePath: any;
  constructor(private router: Router, private toastr: ToastrService, private api: ApiService) {
    if (localStorage.getItem("userToken") == null) {
      this.router.navigate(['/auth']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.username = JSON.parse(localStorage.getItem("username"));
    this.getUserDetails();
  }


  showSuccess(message) {
    this.toastr.success('', message);
  }
  showError(message) {
    this.toastr.error('', message);
  }

  logout() {
    localStorage.clear();
    this.showSuccess('Logout Successfully');
    this.router.navigate(['/auth']);
  }

  getUserDetails() {
    this.api.getUser().subscribe((res) => {
      if (res.success) {
        this.user = res.data;
      }
    });
  }

  updateProfile() {
    this.api.updateUser(this.user).subscribe((res) => {
      if (res.success) {
        this.showSuccess('Profile Updated Successfully');
        document.getElementById("closeModals").click();
      } else {
        this.showError(res.message);
      }
    });
  }

  formData: FormData = new FormData();
  uploadProfileImage(files: FileList) {
    if (files[0] && files[0].type.split('/')[0] !== 'image') {
      this.showError('Invalid Image Format.');
    } else {
      this.formData.append('upload', files[0]);
      this.api.updateUserPic(this.formData).subscribe((res) => {
        if (res.success) {
          this.api.getUser().subscribe((res) => {
            if (res.success) {
              this.user.profile_pic = res.data.profile_pic;
            }
          });
          this.showSuccess('Profile Updated Successfully');
          document.getElementById("closeModals").click();
        }
      }, err => {
        this.showError('Something Went Wrong. Please Try Again');
      });
    }
  };

}
