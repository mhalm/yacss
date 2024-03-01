import { OCPPRequestGenerator } from './OCPPRequestGenerator';
import { describe, it, expect } from 'vitest';

describe('OCPPRequestGenerator', () => {
	const authorizeRequestSchema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		id: 'urn:OCPP:1.6:2019:12:AuthorizeRequest',
		title: 'AuthorizeRequest',
		type: 'object',
		properties: {
			idTag: {
				type: 'string',
				maxLength: 20
			}
		},
		additionalProperties: false,
		required: ['idTag']
	};

	const startTransactionSchema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		id: 'urn:OCPP:1.6:2019:12:StartTransactionRequest',
		title: 'StartTransactionRequest',
		type: 'object',
		properties: {
			connectorId: {
				type: 'integer'
			},
			idTag: {
				type: 'string',
				maxLength: 20
			},
			meterStart: {
				type: 'integer'
			},
			reservationId: {
				type: 'integer'
			},
			timestamp: {
				type: 'string',
				format: 'date-time'
			}
		},
		additionalProperties: false,
		required: ['connectorId', 'idTag', 'meterStart', 'timestamp']
	};

	it('generates a request with default values', () => {
		const generator = new OCPPRequestGenerator(authorizeRequestSchema);
		const jsonData = generator.generateRequest();

		// Adjust the expected result based on your default values
		expect(jsonData).toEqual({
			idTag: '' // Replace with your default string value
		});
	});

	it('generates a request with provided values', () => {
		const generator = new OCPPRequestGenerator(authorizeRequestSchema);
		const jsonData = generator.generateRequest({ idTag: 'myToken123' });

		expect(jsonData).toEqual({
			idTag: 'myToken123'
		});
	});

	it('generates another request with default values', () => {
		const generator = new OCPPRequestGenerator(startTransactionSchema);
		const jsonData = generator.generateRequest();

		// Adjust the expected result based on your default values
		expect(jsonData.timestamp).toEqual(new Date().toISOString());
		expect(jsonData.connectorId).toEqual(1);
		expect(jsonData.idTag).toEqual('');
		expect(jsonData.meterStart).toEqual(1);
	});

	// Add more test cases as needed
});
