import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector : "app-login",
    templateUrl:"./signup.component.html",
    styleUrls : ["./signup.component.css"]
})
export class SignupComponent{
    isLoading=false;
    private authStatusSub:Subscription;
    constructor(public authService:AuthService){}
    ngOnInit(){
        this.authStatusSub=this.authService.getAuthStatusListner().subscribe(
            (authStatus)=>{
                this.isLoading=false;
            }
        )
    }

    onSignup(form : NgForm){
        if(form.invalid){
         return
        }
        this.authService.createUser(form.value.email,form.value.password)

}

ngOnDestroy(){
    this.authStatusSub.unsubscribe();
}

}