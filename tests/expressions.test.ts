// import { Expressions } from "../src/application/expressions"

// it('need to compare email domain and return success', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'matchesToEmailDomain' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: 'assurant', compareTo: 'teste@assurant.com' })).toBeTruthy()
// })

// it('need to compare email domain and return failure', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'matchesToEmailDomain' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: 'hvarconsulting', compareTo: 'teste@assurant.com' })).toBeFalsy()
// })

// it('need to compare two string values and return success', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'equalTo' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: 'teste', compareTo: 'teste' })).toBeTruthy()
// })

// it('need to compare two string values and return failure', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'equalTo' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: 'teste', compareTo: 'fail' })).toBeFalsy()
// })

// it('need to compare two number values and return success', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'equalTo' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: 10, compareTo: 10 })).toBeTruthy()
// })

// it('need to compare two number values and return failure', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'equalTo' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: 10, compareTo: 25 })).toBeFalsy()
// })

// it('need to compare two Dates and check if one is greater than other and return success', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'hourGreaterThan' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: new Date(2020, 1, 1, 10), compareTo: 9 })).toBeTruthy()
// })

// it('need to compare two Dates and check if one is greater than other and return failure', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'hourGreaterThan' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: new Date(2020, 1, 1, 10), compareTo: 11 })).toBeFalsy()
// })

// it('need to compare two Dates and check if one is lower than other and return success', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'hourLowerThan' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: new Date(2020, 1, 1, 10), compareTo: 11 })).toBeTruthy()
// })

// it('need to compare two Dates and check if one is lower than other and return failure', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'hourLowerThan' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: new Date(2020, 1, 1, 10), compareTo: 9 })).toBeFalsy()
// })

// it('need to compare two numbers and check if one is different of another and return success', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'differentOf' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: 10, compareTo: 11 })).toBeTruthy()
// })

// it('need to compare two numbers and check if one is different of another and return failure', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'differentOf' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: 10, compareTo: 10 })).toBeFalsy()
// })

// it('need to compare two strings and check if one is different of another and return success', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'differentOf' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: 10, compareTo: 11 })).toBeTruthy()
// })

// it('need to compare two strings and check if one is different of another and return failure', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'differentOf' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: 10, compareTo: 10 })).toBeFalsy()
// })

// it('need to compare two booleans and check if one is different of another and return success', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'differentOf' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: true, compareTo: false })).toBeTruthy()
// })

// it('need to compare two booleans and check if one is different of another and return failure', () => {
//     const sut = Expressions.getExpression({ expressionValue: 'differentOf' })
//     expect(sut).toBeDefined()
//     expect(sut({ value: true, compareTo: true })).toBeFalsy()
// })
