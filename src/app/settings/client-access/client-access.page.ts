import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ClientService } from 'src/app/clients/client.service';
import { User } from 'src/app/salespipeline/salespipeline.model';
import { Client } from '../../clients/client.model';
import { ClientUser, ClientUserAccess } from '../../models/client-user.model';
import { UserService } from '../../services/user.service';




@Component({
  selector: 'app-client-access',
  templateUrl: './client-access.page.html',
  styleUrls: ['./client-access.page.scss'],
})
export class ClientAccessPage implements OnInit {
  form: FormGroup;
  clients: Client[];
  users: User[];
  selusers:string[];
  clientUsers: ClientUserAccess[];
  loadedUsers: User[]=[];
  isLoading = false;
  constructor(private clientService:ClientService,private userService:UserService,private loadingCtrl:LoadingController) { }
  async ngOnInit() {
    await this.doRefresh();
    this.form = new FormGroup({
      client: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      users: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      })
    })
  }
  onClientChange(event){
    let clientId=event.target.value;
    this.loadedUsers=[];
    this.selusers=[];
    this.form.controls['users'].reset();
    this.users.forEach(user=>{
      if(this.clientUsers.filter(u=>u.userId==user.userId && u.clientId==clientId).length>0){
        user.isActive=true;
        this.selusers.push(user.userId);
      }
      else{
        user.isActive=false;
      }
      this.loadedUsers.push(user);
    })
    this.form.controls['users'].patchValue(this.selusers,{emitEvent: false});
  }

  async mapClientUsers(){
    if (!this.form.valid) {
      return;
    }
    let fusers=this.form.value.users;
    let clientId=this.form.value.client;
    console.log(fusers);
    this.loadingCtrl.create({ keyboardClose: true }).then(async(loadingEl) => {
      loadingEl.present();
     let fclientUsers: ClientUserAccess[]=[];
     //Addtion
     fusers.forEach(user => {
      if(this.clientUsers.filter(u=>u.clientId==clientId).filter(u=>u.userId===user).length<=0){
        fclientUsers.push(new ClientUserAccess(clientId,true,new Date(),user));
      }
     });
     //Deletion
     this.clientUsers.filter(u=>u.clientId==clientId).forEach(client => {
      if(fusers.filter(u=>u==client.userId).length<=0){
        fclientUsers.push(new ClientUserAccess(clientId,false,new Date(),client.userId));
      }
     });
     fclientUsers.forEach(async user=>{
       if(user.isActive){
         await this.userService.addclientUser(user);
       }
       else{
        await this.userService.deleteclientUser(user);
       }
     })
     await this.doRefresh();
     loadingEl.dismiss();
    });
  }

  async doRefresh(){
    this.isLoading=true;
    this.clients=await this.clientService.getClientList();
    this.users= await this.userService.getusers();
    this.clientUsers=await this.userService.getclientusers();
    this.isLoading=false;
  }

}
