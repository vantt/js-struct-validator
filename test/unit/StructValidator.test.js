import StructValidator from '../../src/StructValidator'

describe('Struct Validator', () => {
    let specStructure;

    // Helper function to validate events
    const doValidation = (specification, eventData) => {
        return () => StructValidator.validate(eventData, specification);
    };

    describe('Very basic checks at Top Level', () => {
        beforeAll(() => {
            specStructure = 'string';
        });

        test('validates a valid simple event', () => {
            const validEvent = 'hello';
            expect(doValidation(specStructure, validEvent)).not.toThrow();
        });

        test('throws error for wrong type: number', () => {
            const validEvent = 123;
            expect(doValidation(specStructure, validEvent)).toThrow('Invalid type for : expected string, got number')
        });

        test('throws error for wrong type: boolean', () => {
            const validEvent = true;
            expect(doValidation(specStructure, validEvent)).toThrow('Invalid type for : expected string, got boolean')
        });
    });

    describe('Simple Array at Top Level', () => {
        const SimpleArray = ['string']

        beforeAll(() => {
            specStructure = SimpleArray;
        });

        test('validates a valid simple array', () => {
            const validEvent = ['hello', 'world'];
            expect(doValidation(specStructure, validEvent)).not.toThrow();
        });

        test('throws error for required array but empty', () => {
            const invalidEvent = [];
            expect(doValidation(specStructure, invalidEvent)).toThrow("Array cannot be empty: ");
        });

        test('throws error for wrong type in array', () => {
            const invalidEvent = ['hello', 123];
            expect(doValidation(specStructure, invalidEvent)).toThrow("Invalid type for .1: expected string, got number");
        });
    });

    describe('Simple Object at Top Level', () => {
        const SimpleObject = {
            name$: 'string',
            timestamp$: 'number',
            value: 'number'
        };

        beforeAll(() => {
            specStructure = SimpleObject;
        });

        test('validates a valid simple event', () => {
            const validEvent = {
                name: "Simple Event",
                timestamp: 1623456789,
                value: 42
            };
            expect(doValidation(specStructure, validEvent)).not.toThrow();
        });

        test('throws error for required Object but empty', () => {
            const invalidEvent = {};
            expect(doValidation(specStructure, invalidEvent)).toThrow("Object cannot be empty: ");
        });

        test('throws error for missing required field', () => {
            const invalidEvent = {
                name: "Invalid Simple Event",
                value: 42
            };
            expect(doValidation(specStructure, invalidEvent)).toThrow(/missing required field.*timestamp/i);
        });
    });

    

    describe('Nested Objects', () => {
        const NestedEvent = {
            user$: {
                id$: 'string',
                name: 'string',
                age: 'number'
            },
            action$: 'string'
        };

        beforeAll(() => {
            specStructure = NestedEvent;
        });

        test('validates a valid nested event', () => {
            const validEvent = {
                user: {
                    id: "user123",
                    name: "John Doe",
                    age: 30
                },
                action: "login"
            };
            expect(doValidation(specStructure, validEvent)).not.toThrow();
        });

        test('throws error for missing required nested field', () => {
            const invalidEvent = {
                user: {
                    name: "Jane Doe",
                    age: 25
                },
                action: "logout"
            };
            expect(doValidation(specStructure, invalidEvent)).toThrow(/missing required field.*user.id/i);
        });
    });

    describe('Arrays', () => {
        const ArrayEvent = {
            items$: [{
                id$: 'string',
                quantity: 'number'
            }],
            total$: 'number'
        };

        beforeAll(() => {
            specStructure = ArrayEvent;
        });

        test('validates a valid array event', () => {
            const validEvent = {
                items: [
                    { id: "item1", quantity: 2 },
                    { id: "item2", quantity: 1 }
                ],
                total: 3
            };
            expect(doValidation(specStructure, validEvent)).not.toThrow();
        });

        test('throws error for missing required field in array item', () => {
            const invalidEvent = {
                items: [
                    { id: "item1", quantity: 2 },
                    { quantity: 1 },
                ],
                total: 3
            };
            expect(doValidation(specStructure, invalidEvent)).toThrow('Missing required field: items.1.id');
        });
    });

    describe('Optional Fields', () => {
        const OptionalFieldsEvent = {
            id$: 'string',
            name: 'string',
            description: 'string'
        };

        beforeAll(() => {
            specStructure = OptionalFieldsEvent;
        });

        test('validates event with only required fields', () => {
            const validEvent = {
                id: "event123",
                name: "Optional Event"
            };
            expect(doValidation(specStructure, validEvent)).not.toThrow();
        });

        test('validates event with all fields', () => {
            const validEvent = {
                id: "event456",
                name: "Another Optional Event",
                description: "This field is optional"
            };
            expect(doValidation(specStructure, validEvent)).not.toThrow();
        });
    });

    describe('Default Values', () => {
        const DefaultValueEvent = {
            type$: 'string = standard',
            priority: 'number = 1'
        };

        beforeAll(() => {
            specStructure = DefaultValueEvent;
        });

        test('validates event using defaults', () => {
            const validEvent = {
                type: "standard",
                priority: 1
            };
            expect(doValidation(specStructure, validEvent)).not.toThrow();
        });

        test('validates event overriding defaults', () => {
            const validEvent = {
                priority: 1,
                type: "special"
            };

            expect(doValidation(specStructure, validEvent)).toThrow('Invalid value for type: expected one of [standard], got special');
        });
    });

    describe('Mixed Types', () => {
        const MixedTypeEvent = {
            id$: 'string',
            data$: {
                value: 'number',
                tags: ['string'],
                active: 'boolean'
            },
            timestamp$: 'number'
        };

        beforeAll(() => {
            specStructure = MixedTypeEvent;
        });

        test('validates a valid mixed type event', () => {
            const validEvent = {
                id: "mixed123",
                data: {
                    value: 42.5,
                    tags: ["important", "urgent"],
                    active: true
                },
                timestamp: 1623456789
            };
            expect(doValidation(specStructure, validEvent)).not.toThrow();
        });

        test('throws error for wrong type in array', () => {
            const invalidEvent = {
                id: "mixed456",
                data: {
                    value: 30,
                    tags: ['123', 123], // 123 is not a string
                    active: false
                },
                timestamp: 1623456790
            };
            expect(doValidation(specStructure, invalidEvent)).toThrow('Invalid type for data.tags.1: expected string, got number');
        });
    });
});