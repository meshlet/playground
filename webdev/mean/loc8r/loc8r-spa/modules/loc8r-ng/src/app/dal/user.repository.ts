import { Inject, Injectable } from '@angular/core';
import { CreateUserRspI, LoginUserRspI, UserI } from 'loc8r-common/common.module';
import { Observable } from 'rxjs';
import { BaseDataSource, DATA_SOURCE_INJECT_TOKEN } from './base.datasource';
import { DataAccessLayerModule } from './dal.module';

@Injectable({
  providedIn: DataAccessLayerModule
})
export class UserRepository {
  constructor(@Inject(DATA_SOURCE_INJECT_TOKEN) private dataSource: BaseDataSource) {}

  createUser(user: UserI): Observable<CreateUserRspI['user']> {
    return this.dataSource.createUser(user);
  }

  loginUser(user: UserI): Observable<{ user: LoginUserRspI['user'], jwt: LoginUserRspI['jwt']}> {
    return this.dataSource.loginUser(user);
  }
}
