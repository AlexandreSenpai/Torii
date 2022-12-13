export interface IDatabaseRepository<Entity> {
    find(input: { id: string | number }): Promise<Entity>;
    findByQuery(input: { conditions: { [key: string]: any } }): Promise<Entity[]>
}