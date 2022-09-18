const prompt = require("prompt-sync")({sigint:true});
var UEN = prompt("Enter UEN: ");
validateUEN(UEN)

function validateUEN(uen) {
    const entityTypeIndicator = [
        'LP', 'LL', 'FC', 'PF', 'RF', 'MQ', 'MM', 'NB', 'CC', 'CS', 'MB', 'FM', 'GS',
        'DP', 'CP', 'NR', 'CM', 'CD', 'MD', 'HS', 'VH', 'CH', 'MH', 'CL', 'XL', 'CX',
        'HC', 'RP', 'TU', 'TC', 'FB', 'FN', 'PA', 'PB', 'SS', 'MC', 'SM', 'GA', 'GB'
    ];

    console.log('(A) Businesses registered with ACRA');
    console.log('(B) Local companies registered with ACRA');
    console.log('(C) All other entities which will be issued new UEN');

    // Check for empty UEN
    if (!uen || String(uen) === '') {
        console.log('UEN is empty');
        return false;
    }

    const uenLen = uen.length;

    // Check if UEN length is 9 or 10
    if (uenLen < 9 || uenLen > 10) {
        console.log('This is not a valid UEN format. UEN is not 9 or 10 digits.');
        return false;
    }

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
            for (var i = 4; i < uenLen - 1; i++) {
                // Check that 5th to 9th digits are alphabets
                if (!uenArray[i].match(/[A-Z]/)) {
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
            for (var i = 0; i < entityTypeIndicator.length; i++) {
                if (String(entityTypeIndicator[i]) === String(entityType)) {
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