import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../libs/user-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  data$: BehaviorSubject<UserData> = new BehaviorSubject<UserData>({name: '', password: ''})

  constructor() { }
}
