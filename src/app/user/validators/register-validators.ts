import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";

export class RegisterValidators {
    // factory function design pattern
    static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const control = group.get(controlName);
        const matchControl = group.get(matchingControlName);
    
        if(!control || !matchControl) {
            console.error('Form controls can not be found in the form group')
            return { controlNotFound: false }
        }
    
        const error = control.value === matchControl.value
                        ? null
                        : { noMatch : true }
    
        matchControl.setErrors(error);

        return error;
    }
 }
}

//new RegisterValidators.match() <~ Without static
//RegisterValidators.match() <~ With static but don't have access with class properties