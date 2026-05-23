import { RouteService } from 'src/app/services/route.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/services/branch.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Toast } from 'src/app/services/sweetalert';

@Component({
  selector: 'app-updateroute',
  templateUrl: './updateroute.component.html',
  styleUrls: ['./updateroute.component.css']
})
export class UpdaterouteComponent implements OnInit{
  updateRouteForm: any;
  constructor( 
    private fb:FormBuilder,
    private RouteService:RouteService,
       @Inject(MAT_DIALOG_DATA) public datas: any
  , private dialogRef: MatDialogRef<UpdaterouteComponent>){
    console.log("datas",datas);
  }
  ngOnInit(): void {
  console.log("update rout data",this.datas);
  
    const part = this.datas.part || {};
    this.updateRouteForm = this.fb.group({
      id: [part?.id || null],
      route: [part.route, Validators.required],
      description: [part.description || ''],
    });
  }
  
  
  close(status: any): void {
    this.dialogRef.close(status);
  }
  submitRoute(){
    console.log("updated data",this.updateRouteForm.value);
    this.RouteService.updateRoute(this.updateRouteForm.value).subscribe((res:any)=>{
      console.log("resss",res);

      Toast.fire({
        icon:'success',
        title: res.message
      })
      this.dialogRef.close('success')
      
    })

  }
  
  
}