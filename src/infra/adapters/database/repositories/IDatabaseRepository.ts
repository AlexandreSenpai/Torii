import { Entity } from "../../../../application/core/entities/entity";

export interface IDatabaseRepository {
    find<T>(input: { id: string | number }): Promise<T>;
    findByQuery<T>(input: { conditions: { [key: string]: any } }): Promise<T[]>
}