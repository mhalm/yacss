/* eslint-disable @typescript-eslint/no-explicit-any */
export class OCPPRequestGenerator {
	private schema: any;

	constructor(schema: any) {
		this.schema = schema;
	}

	generateRequest(data: any = {}): any {
		const request: any = {};

		// Check if data has required properties, use default values if not provided
		for (const prop of this.schema.required) {
			request[prop] = data[prop] !== undefined ? data[prop] : this.getDefaultValue(prop);
		}

		// Check for additional properties
		if (!this.schema.additionalProperties) {
			for (const prop in data) {
				if (!this.schema.properties[prop]) {
					throw new Error(`Unexpected property: ${prop}`);
				}
			}
		}

		return request;
	}

	private getDefaultValue(property: string): any {
		// Provide default values based on property type
		const propertySchema = this.schema.properties[property];
		if (propertySchema.type === 'string') {
			if (propertySchema.format === 'date-time') {
				// Example: return current date and time in ISO format
				return new Date().toISOString();
			} else {
				// Example: return an empty string for other string types
				return '';
			}
		} else if (propertySchema.type === 'integer') {
			return 1; // You can set your own default number value
		} else {
			return null; // You can set your own default value for other types
		}
	}
}
