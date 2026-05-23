import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newnotification',
  templateUrl: './newnotification.component.html',
  styleUrls: ['./newnotification.component.css']
})
export class NewnotificationComponent implements OnInit {
  constructor(private route:Router){}
  ngOnInit(): void {
  
  }
 
}
