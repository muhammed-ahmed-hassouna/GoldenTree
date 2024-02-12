const theSum = require('../Jest/sum');

// test(name, function, timeout) // name of test
// it(name, function, timeout)
// describe (name,function)

// test('Return the number', () => {
//     expect(theSum(10)).toBe(10)
// }) // test block

// test('Return Number 1 + Number 2', () => {
//     expect(theSum(10, 10)).toBe(20)
// })

// test('Return Number 1 + Number 2 + Number 3', () => {
//     expect(theSum(10, 10, 10)).toBe(30)
// })

// test('Return Number 0 if no number', () => {
//     expect(theSum()).toBe(0)
// })


// test('Return The sum Results of All numbers', () => {
//     expect(theSum(10, 10, 10, 20, 50, 100)).toBe(200)
// })

// describe('Check The Numbers Sum Total', () => {
//     test('Return the number', () => {
//         expect(theSum(10)).toBe(10)
//     }) // test block

//     test('Return Number 1 + Number 2', () => {
//         expect(theSum(10, 10)).toBe(20)
//     })

//     test('Return Number 1 + Number 2 + Number 3', () => {
//         expect(theSum(10, 10, 10)).toBe(30)
//     })

//     test('Return Number 0 if no number', () => {
//         expect(theSum()).toBe(0)
//     })


//     test('Return The sum Results of All numbers', () => {
//         expect(theSum(10, 10, 10, 20, 50, 100)).toBe(200)
//     })
// })


// describe into describe


// describe('Check The Numbers Sum Total', () => {

//     describe('Check If No Numbers Or One Number', () => {
//         test('Return Number 0 if no number', () => {
//             expect(theSum()).toBe(0)
//         })
//         test('Return the number', () => {
//             expect(theSum(10)).toBe(10)
//         })
//     });

//     describe('For More Than Number', () => {
//         test('Return Number 1 + Number 2', () => {
//             expect(theSum(10, 10)).toBe(20)
//         });

//         test('Return Number 1 + Number 2 + Number 3', () => {
//             expect(theSum(10, 10, 10)).toBe(30)
//         });

//         test('Return The sum Results of All numbers', () => {
//             expect(theSum(10, 10, 10, 20, 50, 100)).toBe(200)
//         });
//     });
// })