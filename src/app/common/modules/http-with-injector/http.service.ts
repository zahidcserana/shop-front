import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/toPromise';
import { EndPoint } from '../../endPoint/config';

@Injectable()
export class HttpService {
    endPoint = EndPoint;

    constructor(private http: HttpClient) {

    }

    get(url: string, option?: any | null): Observable<any> {
        // console.log(this.endPoint);
        return this.http.get(this.endPoint + url, option);
    }

    post(url: string, body: any | null, options?: any | null): Observable<any> {
        // console.log(this.endPoint);
        return this.http.post(this.endPoint + url, body, options);
    }

    put(url: string, body: any | null, options?: any | null): Observable<any> {
        return this.http.put(this.endPoint + url, body, options);
    }

    patch(url: string, body: any | null, options?: any | null): Observable<any> {
        return this.http.patch(this.endPoint + url, body, options);
    }

    delete(url: string, options?: any | null): Observable<any> {
        return this.http.delete(this.endPoint + url, options);
    }

    getErrorMessage(err: HttpErrorResponse) {
        let message = '';
        console.log('err');
        console.log(err.error);
        if (err.error) {
            message = err.error.error ? err.error.error : 'Something went wrong!';
        }
        return message;
    }

    getBlob(url: string): Promise<Blob> {
        return this.http.get<Blob>(this.endPoint + url, {responseType: 'blob' as 'json'}).toPromise();
    }
}

export class HttpConfig {
    endPoint?: string;
}
