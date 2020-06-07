import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
  tasks: any = [];
  today = new Date().getFullYear() + "-" + ((new Date().getMonth() < 10) ? 0 + "" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + ((new Date().getDate() < 10) ? 0 + "" + new Date().getDate() : new Date().getDate());
  currentTime = ((new Date().getHours() < 10) ? 0 + "" + new Date().getHours() : new Date().getHours()) + ":" + ((new Date().getMinutes() < 10) ? 0 + "" + new Date().getMinutes() : new Date().getMinutes());
  task: any = { deadline_date: this.today, deadline_time: this.currentTime };
  page = 1;
  pageSize = 3;
  deadline_dates: any = '';
  deadline_times: any = '';
  completed: any;
  searchTerm: any = '';
  priority: any;
  labels: any;
  pending: any;
  labelss: any;
  deleted: boolean = false;
  count: number = 1;
  lastDeletedId: number;
  user: any = {};
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [];

  constructor(private api: ApiService, private toastr: ToastrService, ) {
  }
  ngOnInit() {
    this.getTasks();
    this.getUserDetails();
  }

  getUserDetails() {
    this.api.getUser().subscribe((res) => {
      if (res.success) {
        this.user = res.data;
      }
    });
  }

  getTasks() {
    this.api.getAllTasks().subscribe((res) => {
      if (res.success) {
        this.tasks = res.tasklist;
        this.pending = res.tasklist.filter(task => task.status != 2).length;
        this.completed = res.tasklist.filter(task => task.status == 2).length;
        let label = res.tasklist.filter(task => task.label == 'Work');
        let label2 = res.tasklist.filter(task => task.label == 'Personal');
        let label3 = res.tasklist.filter(task => task.label == 'Shopping');
        let label4 = res.tasklist.filter(task => task.label == 'Others');
        if (label.length >= label2.length && label.length >= label3.length && label.length >= label4.length) {
          this.labelss = 'Work';
        } else if (label2.length >= label.length && label2.length >= label3.length && label2.length >= label4.length) {
          this.labelss = 'Personal';
        } else if (label3.length >= label.length && label3.length >= label2.length && label3.length >= label4.length) {
          this.labelss = 'Shopping';
        } else if (label4.length >= label.length && label4.length >= label2.length && label4.length >= label3.length) {
          this.labelss = 'Others';
        }
        this.barChartData = res.data;
      } else if (res.message = "No task found!") {
        this.tasks = [];
      }
    }, err => {
      this.showError('Network Error');
    });
  }

  formatTime(time) {
    if (time) {
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

  // create task
  saveTask() {
    if (this.task.deadline_time == "") {
      this.task.deadline_time = null;
    }
    if (this.task.deadline_date == "") {
      this.task.deadline_date = null;
    }
    this.api.createTask(this.task).subscribe((res) => {
      if (res.success) {
        this.task = {};
        this.showSuccess('Task Added Successfully');
        this.getTasks();
        this.resetLabels();
        this.resetForm();
        document.getElementById("closeModal").click();
      } else {
        this.showError(res.message);
      }
    }, err => {
      this.showError('Network Error');
    });
  }


  // update task status
  updateTask(id, status) {
    let taskData = { status };
    this.api.updateTask(id, taskData).subscribe((res) => {
      if (res.success) {
        if (status == 1) {
          this.showSuccess('Task started successfully');
        } else if (status == 2) {
          this.showSuccess('Task completed successfully');
        }
        this.getTasks();
      } else {
        this.showError(res.message);
      }
    }, err => {
      this.showError('Network Error');
    });
  }

  // update task
  updateTaskData() {
    this.api.updateTask(this.task.id, this.task).subscribe((res) => {
      if (res.success) {
        this.showSuccess(res.message)
        this.getTasks();
        this.resetLabels();
        this.resetForm();
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

  // get data for edit
  updateTasks(id) {
    this.tasks.map(task => {
      if (task.id == id) {
        this.task.id = task.id;
        this.task.task_name = task.task_name;
        this.task.label = task.label;
        let removeDate = task.deadline_date.split("T");
        let dates = removeDate[0].split("-");
        this.task.deadline_date = dates[0] + "-" + dates[1] + "-" + dates[2];
        this.task.deadline_time = task.deadline_time;
      }
    });
  }

  deleteTasks(id) {
    this.count = 7;
    this.lastDeletedId = id;
    this.api.deleteTask(id).subscribe((res) => {
      if (res.success) {
        this.showSuccess(res.message);
        this.getTasks();
        this.deleted = true;
        setTimeout(() => {
          this.deleted = false;
          clearInterval(timer);
        }, 7000);
        let timer = setInterval(() => {
          this.count--;
        }, 1000);
      } else {
        this.showError(res.message);
      }
    }, err => {
      this.showError('Network Error');
    });
  }

  undoDeleted(id) {
    let taskData = { active: 1 };
    this.api.updateTask(id, taskData).subscribe((res) => {
      if (res.success) {
        this.showSuccess('Task Recovered successfully');
        this.getTasks();
        this.deleted = false;
      } else {
        this.showError(res.message);
      }
    }, err => {
      this.showError('Network Error');
    });
  }

  shareTask(task) {
    let priority;
    if (task.priority == 0) {
      priority = "Low";
    } else if (task.priority == 1) {
      priority = "Medium";
    } else if (task.priority == 2) {
      priority = "High";
    }
    const taskDetails = "Hey, here is your task.                                                                                                                                                   Task: " + task.task_name + " , \r\rDue Date: " + task.deadline_date + " , " + this.formatTime(task.deadline_time) + " , \r\rLabel: " + task.label + " , \r\rPriority: " + priority;
    window.open('https://web.whatsapp.com/send?text=' + taskDetails, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
  }

  // Notification toasters
  showSuccess(message) {
    this.toastr.success('', message);
  }
  showError(message) {
    this.toastr.error('', message);
  }

  // reset and defaultdate functions
  resetLabels() {
    let labels = document.getElementsByClassName("labels");
    for (let i = 0; i < labels.length; i++) {
      let allLabels = labels.item(i) as HTMLElement;
      allLabels.classList.remove("activeLabel");
    }
  }
  resetForm() {
    this.task.id = null;
    this.task.task_name = "";
    this.task.label = "";
    this.defaultDate();
  }
  defaultDate() {
    this.task.deadline_date = this.today;
    this.task.deadline_time = this.currentTime;
  }
  resetFilter() {
    this.searchTerm = '';
    this.deadline_dates = '';
    this.deadline_times = '';
    this.priority = undefined;
    this.labels = undefined;
  }

}
