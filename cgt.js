'use strict';

// Columns:
// 0: transaction size
// 1: number of shares still held at end of FY
// 2: transaction cost
let shares = `\
233	0	-833.47254
1333	0	-2211.173`
.split('\n')
.map(a=>
a.split('\t').map(x=>+x)
);

// FIFO remaining
/*
let total = 0;
let gains = 0;
for (let i = 0; i < shares.length; ++i) {
    let sellOrder = shares[i];
    if (sellOrder[0] >= 0) continue;
    sellOrder[1] = 0;
    for (let j = 0; j < i && sellOrder[0] < sellOrder[1]; ++j) {
        let order = shares[j];
        if (order[0] - order[1] <= 0) continue;
        let outstanding = Math.min(order[0] - order[1], sellOrder[1] - sellOrder[0]);
        sellOrder[1] -= outstanding;
        order[1] += outstanding;
        sellOrder[2] += outstanding / order[0] * order[2];
    }
    if (sellOrder[0] !== sellOrder[1]) {
        console.error('invalid remaining: expected' + sellOrder[0] + ', actual ' + sellOrder[1]);
    }

    if (sellOrder[2] >= 0) gains += sellOrder[2];
    total += sellOrder[2];
}*/

// LIFO remaining
let total = 0;
let gains = 0;
for (let i = 0; i < shares.length; ++i) {
    let sellOrder = shares[i];
    // >= 0 means it's a buy order
    if (sellOrder[0] >= 0) continue;

    let remaining = -sellOrder[0];
    for (let j = i - 1; j >= 0 && remaining > 0; --j) {
        let order = shares[j];
        if (order[0] - order[1] <= 0) continue;
        let outstanding = Math.min(order[0] - order[1], remaining);
        remaining -= outstanding;
        order[1] += outstanding;
        sellOrder[2] += outstanding / order[0] * order[2];
    }

    if (remaining > 0) {
        console.error('invalid remaining: expected' + sellOrder[0] + ', actual ' + sellOrder[1]);
    }

    if (sellOrder[2] >= 0) gains += sellOrder[2];
    total += sellOrder[2];
}

// FIFO full
/*
let total = 0;
let gains = 0;
for (let i = 0; i < shares.length; ++i) {
    let buyOrder = shares[i];
    // < 0 means it's a sell order
    if (buyOrder[0] < 0) continue;
    buyOrder[1] = buyOrder[0];
}

for (let i = 0; i < shares.length; ++i) {
    let sellOrder = shares[i];
    // >= 0 means it's a buy order
    if (sellOrder[0] >= 0) continue;

    let remaining = -sellOrder[0];
    for (let j = 0; j < i && remaining > 0; ++j) {
        let order = shares[j];
        // Ignore sell orders.
        if (order[0] <= 0) continue;
        let outstanding = Math.min(order[1], remaining);
        remaining -= outstanding;
        order[1] -= outstanding;
        sellOrder[2] += outstanding / order[0] * order[2];
    }

    if (remaining > 0) {
        console.error('invalid remaining: expected' + sellOrder[0] + ', actual ' + sellOrder[1]);
    }

    if (sellOrder[2] >= 0) gains += sellOrder[2];
    total += sellOrder[2];
}
*/

// LIFO full
/*
let total = 0;
let gains = 0;
for (let i = 0; i < shares.length; ++i) {
    let buyOrder = shares[i];
    // < 0 means it's a sell order
    if (buyOrder[0] < 0) continue;
    buyOrder[1] = buyOrder[0];
}

for (let i = 0; i < shares.length; ++i) {
    let sellOrder = shares[i];
    // >= 0 means it's a buy order
    if (sellOrder[0] >= 0) continue;

    let remaining = -sellOrder[0];
    for (let j = i - 1; j >= 0 && remaining > 0; --j) {
        let order = shares[j];
        // Ignore sell orders.
        if (order[0] <= 0) continue;
        let outstanding = Math.min(order[1], remaining);
        remaining -= outstanding;
        order[1] -= outstanding;
        sellOrder[2] += outstanding / order[0] * order[2];
    }

    if (remaining > 0) {
        console.error('invalid remaining: expected' + sellOrder[0] + ', actual ' + sellOrder[1]);
    }

    if (sellOrder[2] >= 0) gains += sellOrder[2];
    total += sellOrder[2];
}
*/

// Minimise CGT
/*
let total = 0;
let gains = 0;
let discountedGains = 0;
for (let i = 0; i < shares.length; ++i) {
    let buyOrder = shares[i];
    // < 0 means it's a sell order
    if (buyOrder[0] < 0) continue;
    buyOrder[1] = buyOrder[0];
}

for (let i = 0; i < shares.length; ++i) {
    let sellOrder = shares[i];
    // >= 0 means it's a buy order
    if (sellOrder[0] >= 0) continue;

    let remaining = -sellOrder[0];
    while (remaining > 0) {
        let bestIdx = -1;
        let bestGain = 0;
        for (let j = 0; j < i; ++j) {
            let order = shares[j];
            if (order[0] - order[1] <= 0) continue;
            // TODO: find what to delete
        }

        if (bestIdx == -1) break;

        let outstanding = Math.min(order[0] - order[1], remaining);
        remaining -= outstanding;
        order[1] += outstanding;
        sellOrder[2] += outstanding / order[0] * order[2];
    }

    if (remaining > 0) {
        console.error('invalid remaining: expected' + sellOrder[0] + ', actual ' + sellOrder[1]);
    }

    if (sellOrder[2] >= 0) gains += sellOrder[2];
    total += sellOrder[2];
}
*/

console.log('Total: ', total);
console.log('Gains: ', gains);
