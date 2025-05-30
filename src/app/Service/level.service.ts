import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LevelService {
    private apiUrl = 'https://localhost:7091/api/Level';

    constructor(private http: HttpClient) { }

    getAllLevels(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
}