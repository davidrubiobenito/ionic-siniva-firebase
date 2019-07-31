import { FormControl } from '@angular/forms';

export class ProductFieldsValidator {

    static isValidUnits(control: FormControl) {
        const re = /^[1-9][0-9]*$/.test(control.value);
        if (re) {
            return null;
        }
        return {
            "invalidEmail": true
        };

    }

    static isValidPrice(control: FormControl) {
        const re = /(^(0|([1-9][0-9]*))(\.[0-9]{1,2})?$)|(^(0{0,1}|([1-9][0-9]*))(\.[0-9]{1,2})?$)/.test(control.value);
        if (re) {
            return null;
        }
        return {
            "invalidPrice": true
        };

    }

    static isValidTax(control: FormControl) {
        const re = /(^(0|([1-9][0-9]*))?$)/.test(control.value);
        if (re) {
            return null;
        }
        return {
            "invalidTax": true
        };

    }

}