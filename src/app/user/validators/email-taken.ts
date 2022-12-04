import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class EmailTaken implements AsyncValidator {
    constructor(private auth: AngularFireAuth) {}

    //must be an arrow function to bind 'this' keyword to lexical scope or context of validate func
    validate = async (control: AbstractControl<any, any>): Promise<ValidationErrors | null> => {
        return this.auth.fetchSignInMethodsForEmail(control.value)
        .then(res => res.length ? { emailTaken: true } : null)
    }
}
