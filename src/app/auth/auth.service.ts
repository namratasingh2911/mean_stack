import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn :'root'

})
export class AuthService{
    private token:string;
    private tokenTimer: any;
    private isAuthenticated=false;
    private userId:string;
    private authStatusListner= new Subject<boolean>();
    constructor(private http: HttpClient,
                private router:Router){}

    getToken(){
        return this.token
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    getUserId(){
        return this.userId;
    }

    getAuthStatusListner(){
        return this.authStatusListner.asObservable();
    }
createUser(email:string,password:string){
    const authData:AuthData={
        email:email, password:password
    }
    
this.http.post("http://localhost:3000/api/users/signup",authData)
.subscribe((response)=>{
    console.log(response)
    this.router.navigate(['/']);
})
}

login(email:string,password:string){
    const authData={email:email,password:password};
    this.http.post<{token:string,expiresIn:number,userId:string}>("http://localhost:3000/api/users/login",authData)
    .subscribe((response)=>{
        console.log(response)
        const token= response.token;
        this.token=token
        if(token){
            const expiresInDuration=response.expiresIn;
            console.log(expiresInDuration);
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated=true;
            this.userId= response.userId;
            this.authStatusListner.next(true);
            const now= new Date();
            const expirationDate= new Date(now.getTime() + expiresInDuration*1000);
            console.log(expirationDate);
            this.saveAthData(token,expirationDate,this.userId);
            this.router.navigate(['/']);
            
        }
        
    })
}

autoAuthUser(){
const authInformation=this.getAuthData();
if(!authInformation){
    return;
}
const now = new Date();
const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
if(expiresIn>0){
    this.token=authInformation.token;
    this.isAuthenticated=true;
    this.userId=authInformation.userId;
    this.setAuthTimer(expiresIn/1000);
    this.authStatusListner.next(true)
}
}

logout(){
    this.token=null;
    this.isAuthenticated=false;
    this.authStatusListner.next(false);
    this.userId=null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
}

private saveAthData(token:string,expirationDate:Date,userId:string){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem('userId',userId);

}

private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');

}

private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate=localStorage.getItem('expiration');
    const userId= localStorage.getItem('userId');
    if(!token && !expirationDate){
     return
    }
    return{
        token : token,
        expirationDate : new Date(expirationDate),
        userId:userId
    }
}

private setAuthTimer(duration:number){
    console.log("Setting timer:" + duration)
    this.tokenTimer=setTimeout(()=>{
        this.logout();
       },duration*1000)
}
}
