// Service corrigé et complété (CourseService)
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';

export interface CourseDTO {
  id: number;
  courseName: string;
  courseDescription: string;
  level: string;
  imageCourse: string;
  duration: string;
  categoryId: number;
  category: string;
  formateur: string;
  userId: number;
  
  }



export interface CategoryDTO {
  id: number;
  categoryName: string;
  imageCategory?: string;
}

export interface LevelDTO {
  id: number;
  name: string;
  description?: string;
}

export interface CreateLevelDTO {
  name: string;
}

export interface UpdateLevelDTO {
  name: string;
}

export interface InstructorDTO {
  id: number;
  address: string;
  cin: string;
  telephone: string;
  specialite: string,


  user :{
    id:number;
    firstName: string,
      lastName: string,
      email: string,
      roleName: string
  }
}

export interface CreateUserWithInstructorDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  profilePicture?: string;
  password: string;
}

export interface UpdateInstructorWithUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  profilePicture?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly apiUrl = 'https://localhost:7091/api/Course';
  private readonly categoryApiUrl = 'https://localhost:7091/api/Category';
  private readonly levelApiUrl = 'https://localhost:7091/api/Level';
  private readonly instructorApiUrl = 'https://localhost:7091/api/Instructors';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    const errorMsg = error.error?.message || error.message || 'Une erreur est survenue';
    return throwError(() => new Error(errorMsg));
  }

  // ====== COURSE METHODS ======
  getAllCourses(): Observable<CourseDTO[]> {
    return this.http.get<CourseDTO[]>(this.apiUrl).pipe(
      map(courses => courses.map(course => ({
        ...course,
        duration: course.duration ?? 'Non spécifiée',
        categoryId: course.categoryId ?? 0
      }))),
      catchError(this.handleError)
    );
  }

  createCourse(courseData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, courseData); 
  }
updateCourse(id: number, courseData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, courseData).pipe(
    catchError(this.handleError)
  );
}

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ====== CATEGORY METHODS ======
  getAllCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(this.categoryApiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCategoryById(id: number): Observable<CategoryDTO> {
    return this.http.get<CategoryDTO>(`${this.categoryApiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createCategory(categoryData: CategoryDTO): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(this.categoryApiUrl, categoryData).pipe(
      catchError(this.handleError)
    );
  }
  

  updateCategory(id: number, categoryData: CategoryDTO): Observable<CategoryDTO> {
    return this.http.put<CategoryDTO>(`${this.categoryApiUrl}/${id}`, categoryData).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoryApiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ====== LEVEL METHODS ======
  getAllLevels(): Observable<LevelDTO[]> {
    return this.http.get<LevelDTO[]>(this.levelApiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getLevelById(id: number): Observable<LevelDTO> {
    return this.http.get<LevelDTO>(`${this.levelApiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createLevel(levelData: CreateLevelDTO): Observable<LevelDTO> {
    return this.http.post<LevelDTO>(this.levelApiUrl, levelData).pipe(
      catchError(this.handleError)
    );
  }

  updateLevel(id: number, levelData: UpdateLevelDTO): Observable<LevelDTO> {
    return this.http.put<LevelDTO>(`${this.levelApiUrl}/${id}`, levelData).pipe(
      catchError(this.handleError)
    );
  }

  deleteLevel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.levelApiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ====== INSTRUCTOR METHODS ======
  getAllInstructors(): Observable<InstructorDTO[]> {
    return this.http.get<InstructorDTO[]>(this.instructorApiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getInstructorById(id: number): Observable<InstructorDTO> {
    return this.http.get<InstructorDTO>(`${this.instructorApiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createInstructor(instructorData: CreateUserWithInstructorDTO): Observable<InstructorDTO> {
    return this.http.post<InstructorDTO>(`${this.instructorApiUrl}/register`, instructorData).pipe(
      catchError(this.handleError)
    );
  }

  updateInstructor(id: number, instructorData: UpdateInstructorWithUserDTO): Observable<InstructorDTO> {
    return this.http.put<InstructorDTO>(`${this.instructorApiUrl}/${id}`, instructorData).pipe(
      catchError(this.handleError)
    );
  }

  deleteInstructor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.instructorApiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}