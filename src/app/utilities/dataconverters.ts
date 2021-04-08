import type firebase from 'firebase';
export function convertTimestampToDate(date:any){
  if(date==null)
  return null;
  date=new Date(date);
  let isodate= date;
  var dd = String(isodate.getDate()).padStart(2, '0');
  var mm = String(isodate.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = isodate.getFullYear();
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return  dd + ' ' + months[Number(mm)-1]  + ' ' + yyyy;
 }

 export function  convertToDateTime(date:any){
  return (date as firebase.firestore.Timestamp).toDate();
 }


