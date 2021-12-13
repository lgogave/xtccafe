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

export function validateDate(ndate:Date){
  let curDate=new Date();
  let invMonth=ndate.getMonth();
  let invYear=ndate.getFullYear();
  let timeInMilisec: number = curDate.getTime() - ndate.getTime();
  let daysBetweenDates: number = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
  let daysInMonth = new Date(invYear, invMonth+1, 0).getDate();
  let totalDays=daysInMonth+5;
  if(daysBetweenDates<totalDays){
    return true;
  }
  return false;
}

