
export abstract class Wrapper<Type> {
    abstract get(): Type

}


export class SingleWrapper<Type> extends Wrapper<Type>{
    protected instance: Type;
    constructor(instance:Type) {
        super();
        this.instance = instance;
    }
    get(): Type {
        return this.instance;
    }
}

export class ThreadedWrapper<Type> extends Wrapper<Type>{
    protected local: Type;
    protected generator: () => Type;
    constructor(generator: () => Type)  {
        super();
        this.generator = generator;
        this.local = generator()
    }
    get(): Type {
        return this.local;
    }
}

