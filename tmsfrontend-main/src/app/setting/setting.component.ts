import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
userdata:any;
  constructor( private userapi:UserService){}
  ngOnInit(): void {
  this.userapi.findCurrentLoginUser().subscribe((res)=>{
    console.log("user dataaa",res);
    this.userdata=res
  })
  }

}
