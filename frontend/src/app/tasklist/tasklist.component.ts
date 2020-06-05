import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
  model: NgbDateStruct;
  tasks: any = [];
  task: any = {};
  labell: string;
  username: string = 'Venkatesh Mogili';
  time = { hour: 12, minute: 12 };
  meridian = true;
  page = 4;
  pageSize = 3;
  deadline_dates: any;
  completed: any;
  constructor(private calendar: NgbCalendar, private api: ApiService, private toastr: ToastrService, ) { }

  ngOnInit() {
    this.getTasks();
  }

  showSuccess(message) {
    this.toastr.success('', message);
  }
  showError(message) {
    this.toastr.error('', message);
  }

  getTasks() {
    this.api.getAllTasks().subscribe((res) => {
      if (res.success) {
        this.tasks = res.tasklist;
        this.completed = res.tasklist.filter(task => task.status == 2);
      } else {
        this.showError(res.status);
      }
    }, err => {
      this.showError('Network Error');
    });
  }

  formatTime(time) {
    let times = time.split(":");
    let finalTime;
    if (times[0] > 11) {
      let evening = times[0] - 12;
      if (evening < 10) {
        finalTime = 0 + "" + evening + ":" + times[1] + " PM";
      } else {
        finalTime = evening + ":" + times[1] + " PM";
      }
    } else {
      finalTime = times[0] + ":" + times[1] + " AM";
    }
    return finalTime;
  }
  setLabel(label, i) {
    let labels = document.getElementsByClassName("labels");
    for (let i = 0; i < labels.length; i++) {
      let allLabels = labels.item(i) as HTMLElement;
      allLabels.classList.remove("activeLabel");
    }
    labels[i].className += " activeLabel";
    this.task.label = label;
  }
  saveTask() {
    this.api.createTask(this.task).subscribe((res) => {
      if (res.success) {
        this.task = {};
        this.showSuccess('Task Added Successfully');
        this.getTasks();
        let labels = document.getElementsByClassName("labels");
        for (let i = 0; i < labels.length; i++) {
          let allLabels = labels.item(i) as HTMLElement;
          allLabels.classList.remove("activeLabel");
        }
        document.getElementById("closeModal").click();
      } else {
        this.showError(res.message);
      }
    }, err => {
      this.showError('Network Error');
    });
  }

  resetLabels() {
    let labels = document.getElementsByClassName("labels");
    for (let i = 0; i < labels.length; i++) {
      let allLabels = labels.item(i) as HTMLElement;
      allLabels.classList.remove("activeLabel");
    }
  }

  updateTask(id, status) {
    let taskData = { status };
    this.api.updateTask(id, taskData).subscribe((res) => {
      if (res.success) {
        this.showSuccess(res.message)
        this.getTasks();
      } else {
        this.showError(res.message);
      }
    }, err => {
      this.showError('Network Error');
    });
  }
  updateTaskData() {
    this.api.updateTask(this.task.id, this.task).subscribe((res) => {
      if (res.success) {
        this.showSuccess(res.message)
        this.getTasks();
        document.getElementById("closeModal").click();
      } else {
        this.showError(res.message);
      }
    }, err => {
      this.showError('Network Error');
    });
  }
  updatePriority(id, priority) {
    let taskData = { priority };
    this.api.updateTask(id, taskData).subscribe((res) => {
      if (res.success) {
        this.showSuccess(res.message)
        this.getTasks();
      } else {
        this.showError(res.message);
      }
    }, err => {
      this.showError('Network Error');
    });
  }
  updateTasks(id) {
    this.tasks.map(task => {
      if (task.id == id) {
        this.task.id = task.id;
        this.task.task_name = task.task_name;
        this.task.label = task.label;
      }
    });
  }
  resetForm() {
    this.task = {};
  }

}
