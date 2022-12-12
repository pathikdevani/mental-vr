import { MemoryStore, VersionWrapper, Version } from "./store"
import { Document } from './document';
import { Data, validate } from './schema'



async function init() {

    type DoucumentSchema = Data;
    type DocumentId = string

    const memory = new MemoryStore<DocumentId, DoucumentSchema & Version>();
    const vMemory = new VersionWrapper<DocumentId, DoucumentSchema & Version, MemoryStore<DocumentId, DoucumentSchema & Version>>(memory)
    const document = new Document<DocumentId, DoucumentSchema, Version>("1", vMemory)
    await document.pull();
    await document.update({ name: 'pathik', color: "test", "score": 1 });
    await document.push();
    memory.log();
}

init()