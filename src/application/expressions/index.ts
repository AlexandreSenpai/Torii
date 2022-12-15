export type AllowedExpressions = 
    "equalTo" | 
    "differentOf" |
    "includes" |
    "notIncludes" |
    "matchesWithEmailDomain" | 
    "hourGreaterThan" | 
    "hourLowerThan";

export interface ExpressionFunction {
    (input: { value: any, compareTo: any }): boolean;
} 

export class Expressions {

    protected expressions: { [key: string]: ExpressionFunction } = {
        "equalTo": this.equalTo,
        "differentOf": this.differentOf,
        "matchesWithEmailDomain": this.matchesToEmailDomain,
        "hourGreaterThan": this.hourGreaterThan,
        "hourLowerThan": this.hourLowerThan,
        "includes": this.includes,
        "notIncludes": this.notIncludes
    }

    protected equalTo(input: { value: string | boolean | number, compareTo: string | boolean | number }): boolean {
        if(typeof input.compareTo === 'string' && input.compareTo?.endsWith('*')) {
         const compareToWithoutAsterisk = input.compareTo?.replace('*', '')
         const userRequestPath = input.value?.toString()?.toLowerCase()
         return userRequestPath?.includes(compareToWithoutAsterisk);
        }

        return input.value === input.compareTo;
    }

    protected differentOf(input: { value: string | boolean | number, compareTo: string | boolean | number }): boolean {
        return input.value !== input.compareTo;
    }
    
    protected matchesToEmailDomain(input: { value: string, compareTo: string }): boolean {
        if(!input.value || !input.compareTo) return false

        const emailDomain = input.compareTo.split("@")[1].split('.')[0].toLowerCase()
        return emailDomain === input.value.toLowerCase()
    }

    protected hourLowerThan(input: { value: Date, compareTo: number }): boolean {
        return input.value.getHours() < input.compareTo;
    }

    protected hourGreaterThan(input: { value: Date, compareTo: number }): boolean {
        return input.value.getHours() > input.compareTo;
    }

    protected includes(input: { value: any[], compareTo: any }): boolean {
        return input.value.includes(input.compareTo);
    }

    protected notIncludes(input: { value: any[], compareTo: any }): boolean {
        return !input.value.includes(input.compareTo);
    }

    public getExpression(input: { expressionName: AllowedExpressions }): ExpressionFunction {
        return this.expressions[input.expressionName];
    }

    public addExpression(input: { expressionName: string, expression: ExpressionFunction, overwrite: boolean}) {
        const doesNotExists = !this.expressions[input.expressionName];
        if(!doesNotExists && !input.overwrite) throw Error('Could not overwrite expression because client decided do not do it.');

        this.expressions[input.expressionName] = input.expression;
    }
    
}