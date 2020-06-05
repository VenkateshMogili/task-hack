import { Component, QueryList, OnInit, ContentChildren, AfterViewInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ApiService } from '../api.service';
import { TasklistComponent } from '../tasklist/tasklist.component';
@Component({
  selector: 'app-taskreport',
  templateUrl: './taskreport.component.html',
  styleUrls: ['./taskreport.component.css']
})
export class TaskreportComponent implements OnInit, AfterViewInit {

  completed: any;
  pending: any;
  tasks: any;
  label: any;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Completed', stack: 'a' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'In progress', stack: 'a' }
  ];
  constructor(private api: ApiService, ) { }

  ngOnInit() {
    this.getTasks();
  }
  ngOnChanges() {
    alert("refreshed");
  }
  @ContentChildren(TasklistComponent)
  public itemList: QueryList<TasklistComponent>;


  public ngAfterViewInit(): void {
    this.itemList.changes.subscribe(() => {
      // put your logi here
      console.log("changed");
    });
  }

  getTasks() {
    this.api.getAllTasks().subscribe((res) => {
      if (res.success) {
        this.tasks = res.tasklist.length;
        this.pending = res.tasklist.filter(task => task.status != 2).length;
        this.completed = res.tasklist.filter(task => task.status == 2).length;
        let label = res.tasklist.filter(task => task.label == 'Work');
        let label2 = res.tasklist.filter(task => task.label == 'Personal');
        let label3 = res.tasklist.filter(task => task.label == 'Shopping');
        let label4 = res.tasklist.filter(task => task.label == 'Others');
        if (label > label2 && label > label3 && label > label4) {
          this.label = 'Work';
        } else if (label2 > label && label2 > label3 && label2 > label4) {
          this.label = 'Personal';
        } else if (label3 > label && label3 > label2 && label3 > label4) {
          this.label = 'Shopping';
        } else if (label4 > label && label4 > label2 && label4 > label3) {
          this.label = 'Others';
        }
      }
    });
  }

}
