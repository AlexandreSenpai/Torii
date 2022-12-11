export class Expressions {

    private static equalTo(input: { value: string | boolean | number, compareTo: string | boolean | number }): boolean {
        if(typeof input.compareTo === 'string' && input.compareTo.endsWith('*')) {
         const compareToWithoutAsterisk = input.compareTo.replace('*', '')
         const userRequestPath = input.value.toString().toLowerCase()
         return userRequestPath.includes(compareToWithoutAsterisk);
        }

        return input.value === input.compareTo;
    }

    private static differentOf(input: { value: string | boolean | number, compareTo: string | boolean | number }): boolean {
        return input.value !== input.compareTo;
    }
    
    private static matchesToEmailDomain(input: { value: string, compareTo: string }): boolean {
        if(!input.value || !input.compareTo) return false

        const emailDomain = input.compareTo.split("@")[1].split('.')[0].toLowerCase()
        return emailDomain === input.value.toLowerCase()
    }

    private static hourLowerThan(input: { value: Date, compareTo: number }): boolean {
        return input.value.getHours() < input.compareTo;
    }

    private static hourGreaterThan(input: { value: Date, compareTo: number }): boolean {
        return input.value.getHours() > input.compareTo;
    }

    public static getExpression(input: { expressionValue: string }): any {
        const expressions = {
            "equalTo": this.equalTo,
            "differentOf": this.differentOf,
            "matchesToEmailDomain": this.matchesToEmailDomain,
            "hourGreaterThan": this.hourGreaterThan,
            "hourLowerThan": this.hourLowerThan
        }
        
        return expressions[input.expressionValue];
    }
}