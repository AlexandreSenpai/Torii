import { v4 as uuid } from 'uuid';

export class Entity<T> {
    public props: T
    public id: string
    public interactionTime: Date

    constructor(props: T, id?: string, interactionTime?: Date) {
        this.props = props
        this.id = id ?? uuid()
        this.interactionTime = interactionTime ?? new Date()
    }

    public toJSON(): { id: string, interactionTime: Date } {
        return Object.assign({}, this.props, { id: this.id, interactionTime: this.interactionTime })
    }
}