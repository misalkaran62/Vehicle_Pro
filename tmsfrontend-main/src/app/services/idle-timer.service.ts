import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleTimerService {
  private timeoutDuration=10*60*1000;
  private timeout:any

constructor(private router:Router) {
  this.resetTimer();
  this.addEventListeners();
 }
 private resetTimer(){
  clearTimeout(this.timeout)
  this.timeout=setTimeout(() => this.logout()    , this.timeoutDuration);
 }
 private addEventListeners(){
  document.addEventListener('mousemove',()=>this.resetTimer());
  document.addEventListener('keydown',()=>this.resetTimer());
  document.addEventListener('click',()=>this.resetTimer());
  document.addEventListener('scroll',()=>this.resetTimer())
 }
 private logout(){
  this.router.navigate(['/auth'])
  sessionStorage.removeItem('token');
 } 
}
