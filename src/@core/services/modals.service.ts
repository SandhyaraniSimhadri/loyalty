import {Injectable} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
    providedIn: 'root',

})
export class ModalsService {
item:any;

    constructor(private modalService: NgbModal,
                //private transfer: FileTransfer,
               ) {
       
    }
    modalOpenDanger(modalDanger,item:any) {
      console.log("item",item);
        this.item=item;
        this.modalService.open(modalDanger, {
          centered: true,
          windowClass: 'modal modal-danger'
        });
      }
      replaceNullsWithEmptyStrings(obj: any): any {
        const updatedObj: any = {};
      
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            updatedObj[key] = value === null ? '' : value;
          }
        }
      
        return updatedObj;
      }
}
