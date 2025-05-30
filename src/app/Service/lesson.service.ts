import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Lesson {
  id: number;
  titre: string;
  URL: string;
  description: string;
  duration: string;
  courseName: string;
  courseId: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'https://localhost:7091/api/Lessons';

  constructor(private http: HttpClient) {}

  getAllLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.apiUrl);
  }

  getLessonById(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${id}`);
  }

  addLesson(lessonData: any): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.apiUrl}/AddLesson`, lessonData);
  }

updateLesson(id: number, data: any): Observable<any> {
  if (!id) {
    return throwError(() => new Error('ID requis'));
  }
  
  // Vérifiez que l'URL correspond à votre API
  return this.http.put(`${this.apiUrl}/${id}`, data).pipe(
    catchError(error => {
      console.error('Erreur modification:', error);
      return throwError(() => error);
    })
  );
}

deleteLesson(id: number): Observable<any> {
  if (!id) {
    return throwError(() => new Error('ID requis'));
  }
  
  // Modification ici pour correspondre à l'API backend
  return this.http.delete(`${this.apiUrl}/${id}`).pipe(
    catchError(error => {
      console.error('Erreur suppression:', error);
      return throwError(() => error);
    })
  );
}

}
