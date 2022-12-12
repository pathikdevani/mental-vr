import { describe, expect, test } from '@jest/globals';
import { MemoryStore, Version, VersionWrapper } from '../store';

describe('Memory store', () => {
    test('create should work', async () => {
        const store = new MemoryStore<string, string>();
        await store.create('1', '1');
        const saved = await store.get('1');
        expect(saved).toBe('1');
    });

    // test('delete/update/etc. should work') {}...
});

describe('Memory store with Version conflict', () => {
    test('create should work with version update', async () => {
        type Schema = { name: string };
        const store = new MemoryStore<string, Schema & Version>();
        const vStore = new VersionWrapper<string, Schema & Version, MemoryStore<string, Schema & Version>>(store)
        await vStore.create('1', { name: "pathik", _v: 0 });
        await vStore.update('1', { name: "pathik", _v: 0 });
        const saved = await vStore.get('1');
        expect(saved?._v).toBe(1);
    });
});

// TODO we can write same for document and schema. 