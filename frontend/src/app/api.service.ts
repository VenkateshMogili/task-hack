import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  updateUserPic(data): Observable<any> {
    this.loadToken();
    console.log(data);
    const httpOptions = {
      headers: new HttpHeaders({
        token: this.authToken
      })
    };
    return this.http
      .post(this.baseUrl + 'users/profile', data, httpOptions)
      .pipe(map(this.extractData));
  };

  // get user
  getUser(): Observable<any> {
    this.loadToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.authToken
      })
    };
    return this.http
      .get(this.baseUrl + 'users/userDetails', httpOptions)
      .pipe(map(this.extractData));
  };

  // Tasks api
  createTask(data): Observable<any> {
    this.loadToken();
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
