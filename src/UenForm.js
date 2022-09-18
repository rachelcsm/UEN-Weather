import React, { Component } from 'react';
import { FormErrors } from './UenErrors.js';
import './css/UenForm.css';
import { TextField, Button } from '@mui/material'

class UenForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            UEN: '',
            formErrors: { UEN: '' },
            uenValid: false,
            formValid: false
        }
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value },
            () => { this.validateUenLength(name, value) });
    }

    validateUenLength() {
        let fieldValidationErrors = this.state.formErrors;
        let uenValid = this.state.uenValid;

        this.setState({
            formErrors: fieldValidationErrors,
            uenValid: uenValid
        }, this.validateForm);
    }

    validate = (e) => {
        e.preventDefault();

        let fieldValidationErrors = this.state.formErrors;
        let uenValid = this.state.uenValid;

        uenValid = this.validateUEN(this.state.UEN);
        fieldValidationErrors.UEN = uenValid ? 'is valid' : ' is invalid';

        this.setState({
            formErrors: fieldValidationErrors,
            uenValid: uenValid
        }, this.validateForm);
    }

    validateUEN(uen) {

        const entityTypeIndicator = [
            'LP', 'LL', 'FC', 'PF', 'RF', 'MQ', 'MM', 'NB', 'CC', 'CS', 'MB', 'FM', 'GS',
            'DP', 'CP', 'NR', 'CM', 'CD', 'MD', 'HS', 'VH', 'CH', 'MH', 'CL', 'XL', 'CX',
            'HC', 'RP', 'TU', 'TC', 'FB', 'FN', 'PA', 'PB', 'SS', 'MC', 'SM', 'GA', 'GB'
        ];

        const uenLen = uen.length;

        console.log('(A) Businesses registered with ACRA');
        console.log('(B) Local companies registered with ACRA');
        console.log('(C) All other entities which will be issued new UEN');

        uen = uen.toUpperCase();
        var uenArray = uen.split('');

        // Check that last digit is a letter
        if (!uenArray[uenLen - 1].match(/[A-Z]/)) {
            console.log('This is not a valid UEN format. Last digit is not an alphabet.');
            return false;
        }

        // (A) Businesses registered with ACRA
        if (uenLen === 9) {
            for (var i = 0; i < uenLen - 1; i++) {
                // Check that first 8 are all numbers
                if (isNaN(uenArray[i])) {
                    console.log('This is not a valid UEN format issued to (A). There are non-numbers in 1st to 8th digits.');
                    return false;
                }
            }

            console.log('This is a valid UEN issued to (A).');
            return true;
        }

        else if (uenLen === 10) {
            // (B) Local companies registered with ACRA
            // Check that first 4 digits are numbers
            if (!isNaN(uenArray[0]) && !isNaN(uenArray[1]) && !isNaN(uenArray[2]) && !isNaN(uenArray[3])) {
                for (var j = 4; j < uenLen - 1; j++) {
                    // Check that 5th to 9th digits are alphabets
                    if (!uenArray[j].match(/[A-Z]/)) {
                        console.log('This is not a valid UEN format issued to (B). There are non-alphabets in 5th to 9th digits.');
                        return false;
                    }
                    else {
                        console.log('This is a valid UEN issued to (B).');
                        return true;
                    }
                }
            }

            // (C) All other entities which will be issued new UEN
            else {
                // Check that 1st digit is either T or S
                if (uenArray[0] !== 'T' && uenArray[0] !== 'S') {
                    console.log('This is not a valid UEN format issued to (C). The first digit is not T or S.');
                    return false;
                }

                // Check that 2nd and 3rd digits are numbers only
                if (isNaN(uenArray[1]) || isNaN(uenArray[2])) {
                    console.log('This is not a valid UEN format issued to (C). There are non-numbers in 2nd or 3rd digits.');
                    return false;
                }

                // Check entity-type indicator
                var entityTypeMatch = false;
                var entityType = String(uenArray[3]) + String(uenArray[4]);
                for (var k = 0; k < entityTypeIndicator.length; k++) {
                    if (String(entityTypeIndicator[k]) === String(entityType)) {
                        entityTypeMatch = true;
                    }
                }
                if (!entityTypeMatch) {
                    console.log('This is not a valid UEN format issued to (C). Entity-type indicator is invalid.');
                    return false;
                }

                // Check that 6th to 9th digits are numbers only
                if (isNaN(uenArray[5]) || isNaN(uenArray[6]) || isNaN(uenArray[7]) || isNaN(uenArray[8])) {
                    console.log('This is not a valid UEN format issued to (C). There are non-numbers in 6th to 9th digits.');
                    return false;
                }

                console.log('This is a valid UEN issued to (C).');
                return true;
            }
        }

        return false;
    }

    validateForm() {
        this.setState({ formValid: this.state.uenValid });
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    render() {
        return (
            <form className="uenForm">
                <div className={`form-group ${this.errorClass(this.state.formErrors.UEN)}`}>
                    <TextField type="UEN" className="form-control tfUen" name="UEN" variant="outlined" label="UEN" size="small"
                        placeholder="Input UEN (9/10 Digits)" inputProps={{ maxLength: 10 }}
                        value={this.state.UEN}
                        onChange={this.handleUserInput} />
                    <Button type="submit" variant="outlined" className='validateBtn'
                    onClick={this.validate} validate>Validate</Button>
                </div>

                <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors} />
                </div>

                <a className="Uen-link" href="https://www.uen.gov.sg/ueninternet/faces/pages/admin/aboutUEN.jspx" target="_blank"
                    rel="noopener noreferrer">
                    Click here for UEN Guidelines </a>
            </form>
        )
    }
}

export default UenForm;