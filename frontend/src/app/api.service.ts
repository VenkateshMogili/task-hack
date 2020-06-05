import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: string = "http://localhost:8080/api/";
  authToken: any;
  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
  constructor(private http: HttpClient) { }

  loadToken() {
    const token = JSON.parse(localStorage.getItem('userToken'));
    this.authToken = token;
  };

  // user api

  // sign up
  createUser(data): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post(this.baseUrl + 'users/signup', data, httpOptions)
      .pipe(map(this.extractData));
  };

  // login
  login(data): Observable<any> {
    return this.http
      .post(this.baseUrl + 'users/login', data)
      .pipe(map(this.extractData));
  };

  // update user
  updateUser(data): Observable<any> {
    this.loadToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.authToken
      })
    };
    return this.http
      .put(this.baseUrl + 'users/update', data, httpOptions)
      .pipe(map(this.extractData));
  };

  // get user
  getUser(id): Observable<any> {
    this.loadToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.authToken
      })
    };
    return this.http
      .get(this.baseUrl + 'users/' + id, httpOptions)
      .pipe(map(this.extractData));
  };

  // Tasks api
  createTask(data): Observable<any> {
    this.loadToken();
    data.deadline_date = data.deadline_date.year + "-" +
      data.deadline_date.day + "-" + data.deadline_date.month;
    data.deadline_time = data.deadline_time.hour + ":" + data.deadline_time.minute
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.authToken
      })
    };
    return this.http
      .post(this.baseUrl + 'tasks/create', data, httpOptions)
      .pipe(map(this.extractData));
  };
  updateTask(id, data): Observable<any> {
    this.loadToken();
    if (data.deadline_date && data.deadline_time) {
      data.deadline_date = data.deadline_date.year + "-" +
        data.deadline_date.day + "-" + data.deadline_date.month;
      data.deadline_time = data.deadline_time.hour + ":" + data.deadline_time.minute
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.authToken
      })
    };
    return this.http
      .put(this.baseUrl + 'tasks/update/' + id, data, httpOptions)
      .pipe(map(this.extractData));
  };

  deleteTask(id): Observable<any> {
    this.loadToken();
    const httpOptions = {
      headers: new HttpHeaders({
        token: this.authToken
      })
    };
    return this.http
      .delete(this.baseUrl + 'tasks/delete/' + id, httpOptions)
      .pipe(map(this.extractData));
  };

  getTask(id): Observable<any> {
    this.loadToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.authToken
      })
    };
    return this.http
      .get(this.baseUrl + 'tasks/' + id, httpOptions)
      .pipe(map(this.extractData));
  };

  getAllTasks(): Observable<any> {
    this.loadToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.authToken
      })
    };
    return this.http
      .get(this.baseUrl + 'tasks', httpOptions)
      .pipe(map(this.extractData));
  };
}
