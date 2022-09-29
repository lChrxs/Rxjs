import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/share.service';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss']
})
export class FirstComponent implements OnInit {

  constructor(private shareS: ShareService) { }

  ngOnInit(): void {
  }

  onClick(){
    this.shareS.data$.next({name: 'aaa', password: '23e'})
  }



}
