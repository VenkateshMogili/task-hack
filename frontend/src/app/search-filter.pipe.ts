import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any, searchTerm: any, date: any, time: any, priority: any, labels: any) {
    if (searchTerm && date && time && priority && labels) {
      if (searchTerm.length > 0) {
        searchTerm = searchTerm.toLowerCase();
      }
      if (priority == "low") {
        priority = 0;
      }
      return value.filter((task) => {
        return ((searchTerm ? task.task_name.toLowerCase().indexOf(searchTerm) > -1 : '') && ((date ? task.deadline_date.indexOf(date) > -1 : '') &&
          (time ? task.deadline_time == time + ":00" : '')) && (priority != undefined ? task.priority == priority : undefined)
          && (labels != undefined ? task.label == labels : undefined))
      });
    } else if (searchTerm && priority && labels) {
      if (searchTerm.length > 0) {
        searchTerm = searchTerm.toLowerCase();
      }
      if (priority == "low") {
        priority = 0;
      }
      return value.filter((task) => {
        return ((searchTerm ? task.task_name.toLowerCase().indexOf(searchTerm) > -1 : '') && (priority != undefined ? task.priority == priority : undefined)
          && (labels != undefined ? task.label == labels : undefined))
      });
    } else if (searchTerm && date && time && priority) {
      if (searchTerm.length > 0) {
        searchTerm = searchTerm.toLowerCase();
      }
      if (priority == "low") {
        priority = 0;
      }
      return value.filter((task) => {
        return ((searchTerm ? task.task_name.toLowerCase().indexOf(searchTerm) > -1 : '') && ((date ? task.deadline_date.indexOf(date) > -1 : '') &&
          (time ? task.deadline_time == time + ":00" : '')) && (priority != undefined ? task.priority == priority : undefined))
      });
    } else if (searchTerm && date && time && labels) {
      if (searchTerm.length > 0) {
        searchTerm = searchTerm.toLowerCase();
      }
      return value.filter((task) => {
        return ((searchTerm ? task.task_name.toLowerCase().indexOf(searchTerm) > -1 : '') && ((date ? task.deadline_date.indexOf(date) > -1 : '') &&
          (time ? task.deadline_time == time + ":00" : '')) && (labels != undefined ? task.label == labels : undefined))
      });
    } else if (searchTerm && date && time) {
      if (searchTerm.length > 0) {
        searchTerm = searchTerm.toLowerCase();
      }
      return value.filter((task) => {
        return ((searchTerm ? task.task_name.toLowerCase().indexOf(searchTerm) > -1 : '') && ((date ? task.deadline_date.indexOf(date) > -1 : '') &&
          (time ? task.deadline_time == time + ":00" : '')))
      });
    } else if (searchTerm && priority) {
      if (searchTerm.length > 0) {
        searchTerm = searchTerm.toLowerCase();
      }
      if (priority == "low") {
        priority = 0;
      }
      return value.filter((task) => {
        return ((searchTerm ? task.task_name.toLowerCase().indexOf(searchTerm) > -1 : '') && (priority != undefined ? task.priority == priority : undefined))
      });
    } else if (searchTerm && labels) {
      if (searchTerm.length > 0) {
        searchTerm = searchTerm.toLowerCase();
      }
      return value.filter((task) => {
        return ((searchTerm ? task.task_name.toLowerCase().indexOf(searchTerm) > -1 : '') && (labels != undefined ? task.label == labels : undefined))
      });
    } else if (date && time && priority && labels) {
      if (priority == "low") {
        priority = 0;
      }
      return value.filter((task) => {
        return (((date ? task.deadline_date.indexOf(date) > -1 : '') &&
          (time ? task.deadline_time == time + ":00" : '')) && (priority != undefined ? task.priority == priority : undefined)
          && (labels != undefined ? task.label == labels : undefined))
      });
    } else if (priority && labels) {
      if (priority == "low") {
        priority = 0;
      }
      return value.filter((task) => {
        return ((priority != undefined ? task.priority == priority : undefined)
          && (labels != undefined ? task.label == labels : undefined))
      });
    } else if (date && time && labels) {
      return value.filter((task) => {
        return (((date ? task.deadline_date.indexOf(date) > -1 : '') &&
          (time ? task.deadline_time == time + ":00" : '')) && (labels != undefined ? task.label == labels : undefined))
      });
    } else if (date && time && priority) {
      if (priority == "low") {
        priority = 0;
      }
      return value.filter((task) => {
        return ((date ? task.deadline_date.indexOf(date) > -1 : '') &&
          (time ? task.deadline_time == time + ":00" : '') && (priority != undefined ? task.priority == priority : undefined))
      });
    } else if (labels) {
      return value.filter((task) => {
        return (labels != undefined ? task.label == labels : undefined)
      });
    } else if (priority) {
      if (priority == "low") {
        priority = 0;
      }
      return value.filter((task) => {
        return (priority != undefined ? task.priority == priority : undefined)
      });
    } else if (date && time) {
      return value.filter((task) => {
        return ((date ? task.deadline_date.indexOf(date) > -1 : '') &&
          (time ? task.deadline_time == time + ":00" : ''))
      });
    } else if (searchTerm) {
      if (searchTerm.length > 0) {
        searchTerm = searchTerm.toLowerCase();
      }
      return value.filter((task) => {
        return (searchTerm ? task.task_name.toLowerCase().indexOf(searchTerm) > -1 : '')
      });
    } else {
      return value;
    }
  }

}
