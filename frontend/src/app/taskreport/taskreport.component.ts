import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
@Component({
  selector: 'app-taskreport',
  templateUrl: './taskreport.component.html',
  styleUrls: ['./taskreport.component.css']
})
export class TaskreportComponent implements OnInit {

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
  constructor() { }

  ngOnInit() {
  }

}
