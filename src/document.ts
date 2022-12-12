import { IStore } from "./store";


enum Opration {
    CREAT,
    DELETE,
    UPDATE,
    NONE
}


function merge(a: Object = {}, b: Object = {}) {
    return {
        ...a,
        ...b
    }
}

export class Document<DocumentId, DocumentData extends Object, MetaData> {
    readonly id: DocumentId;
    private store: IStore<DocumentId, DocumentData & MetaData>
    private data?: DocumentData & MetaData;
    private patched?: DocumentData;

    private opration: Opration = Opration.NONE


    constructor(id: DocumentId, store: IStore<DocumentId, DocumentData & MetaData>) {
        this.id = id;
        this.store = store;
    }

    log() {
        console.log(this.data, this.patched);
    }

    async pull() {
        const exist = await this.store.isExists(this.id);
        if (exist) {
            const pulled = await this.store.get(this.id);
            this.data = pulled;
        } else {
            this.opration = Opration.CREAT;
        }

    }

    async push() {

        switch (this.opration) {
            case Opration.CREAT:
                await this.store.create(this.id, merge(this.data, this.patched) as DocumentData & MetaData)
                break;

            case Opration.UPDATE:
                this.data = await this.store.update(this.id, merge(this.data, this.patched) as DocumentData & MetaData)
                break;

            case Opration.DELETE:
                await this.store.delete(this.id)
                break;
        }
        const data = await this.store.get(this.id);
        this.data = data;
        this.opration = Opration.NONE;
        this.patched = undefined;
    }

    update(data: DocumentData) {
        this.patched = data;
        if (this.opration !== Opration.CREAT && this.opration !== Opration.DELETE) {
            this.opration = Opration.UPDATE;
        }
    }

    read() {
        return merge(this.data, this.patched) as DocumentData & MetaData;
    }

    delete() {
        this.patched = undefined;
        this.opration = Opration.DELETE;
    }

    revert() {
        this.patched = undefined;
    }
}