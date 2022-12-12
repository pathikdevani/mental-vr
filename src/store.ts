export type Version = {
	_v: number
}


export interface IStore<Key, Schema> {
	create(key: Key, data: Schema): Promise<void>
	get(key: Key,): Promise<Schema | undefined>
	update(key: Key, data: Schema): Promise<Schema>
	delete(key: Key): Promise<void>
	isExists(key: Key): Promise<boolean>
}

// export class MongoDBStore<...
// export class RedisStore<..
// export class HTTPStore<..
// etc...

export class MemoryStore<Key, Schema> implements IStore<Key, Schema> {
	private data = new Map<Key, Schema>();

	async create(key: Key, data: Schema) {
		if (this.data.has(key)) {
			throw Error("MemoryStore: key exist, can not craete entry")
		}
		this.data.set(key, data)
	}

	async get(key: Key): Promise<Schema | undefined> {
		return this.data.get(key);
	}

	async update(key: Key, data: Schema) {
		if (!this.data.has(key)) {
			throw Error("MemoryStore: key not exist, can not update entry")
		}

		this.data.set(key, data);
		return data;
	}


	async delete(key: Key) {
		if (!this.data.has(key)) {
			throw Error("MemoryStore: key not exist, can not delete entry")
		}
		this.data.delete(key);
	}

	async isExists(key: Key): Promise<boolean> {
		return this.data.has(key);
	}

	log() {
		console.log(this.data);
	}
}

// export class VersionWrapper<MongoDBStore<...
// export class VersionWrapper<RedisStore<..
// export class VersionWrapper<HTTPStore<..
// etc...


export class VersionWrapper<Key, Schema extends Version, Store extends IStore<Key, Schema>> implements IStore<Key, Schema> {
	store: Store
	constructor(store: Store) {
		this.store = store;
	}

	async create(key: Key, data: Schema) {
		data._v = 0;
		await this.store.create(key, data)
	}
	async get(key: Key): Promise<Schema | undefined> {
		return await this.store.get(key);
	}
	async update(key: Key, data: Schema): Promise<Schema> {
		const current = await this.get(key);
		if (!current) {
			throw Error("VersionWrapper: key not exists, can not update entry")
		}

		if (data._v !== current._v) {
			throw Error(`VersionWrapper: current version is ${current._v}, so you update data with ${data._v}`)
		}

		data._v += 1;
		return await this.store.update(key, data)
	}
	async delete(key: Key) {
		await this.store.delete(key);
	}
	async isExists(key: Key): Promise<boolean> {
		return await this.store.isExists(key)
	}

}


