import StructValidator from '../../src/StructValidator';

describe('Struct Validator', () => {
    let specStructure;

    // Helper function to validate events
    const validateEvent = (eventName, eventData) => {
        return () => StructValidator.validate(eventData, specStructure);
    };

    describe('Simple Event', () => {
        const SimpleEvent = {
            name$: 'string',
            timestamp$: 'number',
            value: 'number'
        };

        beforeAll(() => {
            specStructure = SimpleEvent;
        });

        test('validates a valid simple event', () => {
            const validEvent = {
                name: "Simple Event",
                timestamp: 1623456789,
                value: 42
            };
            expect(validateEvent('SimpleEvent', validEvent)).not.toThrow();
        });

        test('throws error for missing required field', () => {
            const invalidEvent = {
                name: "Invalid Simple Event",
                value: 42
            };
            expect(validateEvent('SimpleEvent', invalidEvent)).toThrow(/missing required field.*timestamp/i);
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
            expect(validateEvent('NestedEvent', validEvent)).not.toThrow();
        });

        test('throws error for missing required nested field', () => {
            const invalidEvent = {
                user: {
                    name: "Jane Doe",
                    age: 25
                },
                action: "logout"
            };
            expect(validateEvent('NestedEvent', invalidEvent)).toThrow(/missing required field.*user.id/i);
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
            expect(validateEvent('ArrayEvent', validEvent)).not.toThrow();
        });

        test('throws error for missing required field in array item', () => {
            const invalidEvent = {
                items: [
                    { id: "item1", quantity: 2 },
                    { quantity: 1 }
                ],
                total: 3
            };
            expect(validateEvent('ArrayEvent', invalidEvent)).toThrow(/missing required field.*items\[1\].id/i);
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
            expect(validateEvent('OptionalFieldsEvent', validEvent)).not.toThrow();
        });

        test('validates event with all fields', () => {
            const validEvent = {
                id: "event456",
                name: "Another Optional Event",
                description: "This field is optional"
            };
            expect(validateEvent('OptionalFieldsEvent', validEvent)).not.toThrow();
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
            expect(validateEvent('DefaultValueEvent', validEvent)).not.toThrow();
        });

        test('validates event overriding defaults', () => {
            const validEvent = {
                priority: 1,
                type: "special"
            };

            expect(validateEvent('DefaultValueEvent', validEvent)).toThrow('Invalid value for type: expected one of [standard], got special');
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
            expect(validateEvent('MixedTypeEvent', validEvent)).not.toThrow();
        });

        test.only('throws error for wrong type in array', () => {
            const invalidEvent = {
                id: "mixed456",
                data: {
                    value: 30,
                    tags: ['123', 123], // 123 is not a string
                    active: false
                },
                timestamp: 1623456790
            };
            expect(validateEvent('MixedTypeEvent', invalidEvent)).toThrow('Invalid type for data.tags.0: expected string, got number');
        });
    });
});