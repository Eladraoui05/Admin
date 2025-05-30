import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7091/api';

  constructor(private http: HttpClient) { }

  // Méthodes générales
  getAllUsersWithRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getUserDetails(userId: number, role: string): Observable<any> {
    const endpoint = role.toLowerCase() + 's';
    return this.http.get(`${this.apiUrl}/${endpoint}/${userId}/details`);
  }

  // Méthodes pour Students
  createStudent(studentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Students/register`, studentData);
  }

  updateStudent(id: number, studentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/students/${id}`, studentData);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/students/${id}`);
  }

  // Méthodes pour Parents
  getAllParents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/parents`);
  }

  createParent(parentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/parents/register`, parentData);
  }

  updateParent(id: number, parentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/parents/${id}`, parentData);
  }

  deleteParent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/parents/${id}`);
  }

  // Méthodes pour Instructors
  createInstructor(instructorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/instructors/register`, instructorData);
  }

  updateInstructor(id: number, instructorData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/instructors/${id}`, instructorData);
  }

  deleteInstructor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/instructors/${id}`);
  }
}