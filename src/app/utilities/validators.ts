import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
export function NoNegativeNumbers(control: AbstractControl) {
  return control.value < 0 ? { negativeNumber: true } : null;
}

export function atLeastOne(): ValidatorFn {
  return (formGroup: FormGroup) => {
    const emailControl = formGroup.get('email');
    const contactNumberControl = formGroup.get('contactNumber');
    if (!emailControl || !contactNumberControl) {
      return null;
    }

    if ((emailControl.value == null || emailControl.value=='') &&
      (contactNumberControl.value == null || contactNumberControl.value=='')
    ) {
      return null;
    }
    else{
      return { contactDetail: true };
    }
  }
}

