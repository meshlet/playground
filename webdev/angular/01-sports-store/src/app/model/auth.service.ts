/**
 * The service used for user authentication.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestDatasource } from './rest.datasource';

@Injectable()
export class AuthService {
  constructor(private dataSource: RestDatasource) {
  }

  authenticate(username: string, password: string): Observable<boolean> {
    return this.dataSource.authenticate(username, password);
  }

  isAuthenticated(): boolean {
    return !!this.dataSource.getAuthToken();
  }

  clear(): void {
    this.dataSource.resetAuthToken();
  }
}
