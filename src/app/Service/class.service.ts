import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class classService {
    private apiUrl = 'https://localhost:7091/api/class';

    constructor(private http: HttpClient) { }

    getAllClasses(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
}