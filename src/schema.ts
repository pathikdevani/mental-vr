import Ajv, { JSONSchemaType } from "ajv"
const ajv = new Ajv()

export interface Data {
    name?: string
    score?: number
    color?: string
}

const Schema: JSONSchemaType<Data> = {
    type: "object",
    properties: {
        name: { type: "string", nullable: true },
        color: { type: "string", nullable: true },
        score: { type: "number", nullable: true },
    },
    additionalProperties: false
}

// we can use this to valid date whenever we submit to store or push
export const validate = ajv.compile(Schema)


