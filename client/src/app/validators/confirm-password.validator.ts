import {ValidatorFn, AbstractControl} from '@angular/forms';

export function confirmPasswordValidator(obj: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const isValid = obj.userPassword === control.value;
    return isValid ? null : {'confirmPassword': {value: control.value}};
  };
}
