# js-struct-validator
js library helps validate an object follow a predefined structure.

## Usage Guide
### Table of Contents
1. [Structure Overview](#structure-overview)
2. [Basic Usage](#basic-usage)
3. [Usage Cases](#usage-cases)
   - [Simple Event](#simple-event)
   - [Nested Objects](#nested-objects)
   - [Arrays](#arrays)
   - [Optional Fields](#optional-fields)
   - [Default Values](#default-values)
   - [Mixed Types](#mixed-types)
4. [Validation Process](#validation-process)

### Structure Overview

The validation structure uses native JavaScript objects with a special syntax to define event schemas:

- Field names ending with `$` are required.
- `type` specifies the expected data type (String, Number, Boolean, Object, Array).
- `default` specifies a default value for the field.
- For objects, use `properties` to define nested fields.
- For arrays, use `items` to define the structure of array elements.

### Basic Usage

```javascript
import FacebookEventStructures from './FacebookEventStructures';
import FacebookEventValidator from './FacebookEventValidator';

// Define an event structure
const eventStructure = FacebookEventStructures.structures.SomeEvent;

// Validate an event
try {
  FacebookEventValidator.validate(eventData);
  console.log("Event is valid");
} catch (error) {
  console.error("Validation error:", error.message);
}
```

### Usage Cases

### Validation Process

The validation process involves the following steps:

1. Retrieve the event structure from a structure.
2. Use `StructValidator` to validate the event data against the structure.
3. The validator checks:
   - Presence of all required fields (marked with `$`)
   - Correct data types for all fields
   - Validity of nested objects and arrays
   - Application of default values where necessary

If any validation errors occur, an error is thrown with a descriptive message indicating the nature and location of the error in the event data.

```javascript
const SimpleEvent = {
            name$: 'string',
            timestamp$: 'number',
            value: 'number'
        };

// Valid event
const validSimpleEvent = {
  name: "Simple Event",
  timestamp: 1623456789,
  value: 42
};

// Invalid event (missing required field)
const invalidSimpleEvent = {
  name: "Invalid Simple Event",
  value: 42
};

import StructValidator from '@trantoanvan/js-struct-validator'

StructValidator.validate(validSimpleEvent, SimpleEventSpecification); // do not throw error
StructValidator.validate(invalidSimpleEvent, SimpleEventSpecification); // throw error: missing timestamp field 

```
### More about Specification

#### Nested Objects

```javascript
const NestedEvent = {
            user$: {
                id$: 'string',
                name: 'string',
                age: 'number'
            },
            action$: 'string'
        };

// Valid nested event
const validNestedEvent = {
  user: {
    id: "user123",
    name: "John Doe",
    age: 30
  },
  action: "login"
};

// Invalid nested event (missing required nested field)
const invalidNestedEvent = {
  user: {
    name: "Jane Doe",
    age: 25
  },
  action: "logout"
};
```

#### Arrays

```javascript
const ArrayEvent = {
            items$: [{
                id$: 'string',
                quantity: 'number'
            }],
            total$: 'number'
        };

// Valid array event
const validArrayEvent = {
  items: [
    { id: "item1", quantity: 2 },
    { id: "item2", quantity: 1 }
  ],
  total: 3
};

// Invalid array event (missing required field in array item)
const invalidArrayEvent = {
  items: [
    { id: "item1", quantity: 2 },
    { quantity: 1 }
  ],
  total: 3
};
```

#### Optional Fields

```javascript
const OptionalFieldsEvent = {
            id$: 'string',
            name: 'string',
            description: 'string'
        };

// Valid event with optional fields
const validOptionalEvent = {
  id: "event123",
  name: "Optional Event"
};

// Also valid (includes all fields)
const anotherValidOptionalEvent = {
  id: "event456",
  name: "Another Optional Event",
  description: "This field is optional"
};
```

#### Default Values

```javascript
const DefaultValueEvent = {
            type$: 'string = standard',
            priority: 'number = 1'
        };

// Valid event using defaults
const validDefaultEvent = {
  type: "standard"
};

// Valid event overriding defaults
const invalidDefaultEvent = {
  type: "special",
  priority: 1
};

const invalidDefaultEvent = {
  type: "standard",
  priority: 3
};
```

#### Mixed Types

```javascript
const MixedTypeEvent = {
            id$: 'string',
            data$: {
                value: 'number',
                tags: ['string'],
                active: 'boolean'
            },
            timestamp$: 'number'
        };

// Valid mixed type event
const validMixedTypeEvent = {
  id: "mixed123",
  data: {
    value: 42.5,
    tags: ["important", "urgent"],
    active: true
  },
  timestamp: 1623456789
};

// Invalid mixed type event (wrong type for array item)
const invalidMixedTypeEvent = {
  id: "mixed456",
  data: {
    value: 30,
    tags: ["critical", 123], // 123 is not a string
    active: false
  },
  timestamp: 1623456790
};
```

## Publish Package to NPM
Publishing a GitHub repository to npm involves several steps, from setting up your project to actually publishing it. Here's a comprehensive guide on how to do this:

### Steps to Publish a GitHub Repository to npm

1. **Prepare Your Project**

   - **Ensure your project has a `package.json` file**: This file is essential as it contains metadata about your package, including its name, version, description, and entry point.
     ```bash
     npm init
     ```
     This command will prompt you for information and generate a `package.json` file.

   - **Add your code**: Make sure your code is ready and organized in your repository. The entry point specified in `package.json` should exist (e.g., `index.js`).

2. **Set Up Your GitHub Repository**

   - **Create a GitHub repository**: If you haven't already, create a new repository on GitHub where your project will be hosted.

   - **Link the repository**: Add the repository URL to the `repository` field in your `package.json` file. This helps users find the source code.
     ```json
     "repository": {
       "type": "git",
       "url": "https://github.com/your-username/your-repo.git"
     }
     ```

3. **Login to npm**

   - Ensure you have an npm account. If not, sign up on the npm website.
   - Log in to npm via the command line:
     ```bash
     npm login
     ```
   - Enter your npm username, password, and email when prompted.

4. **Publish Your Package**

   - **Initial Publish**: Run the following command to publish your package to the npm registry:
     ```bash
     npm publish --access public
     ```
   - Ensure that the package name is unique on npm; otherwise, you may need to use a scoped name (e.g., `@username/package-name`).

5. **Automate Publishing with GitHub Actions (Optional)**

   You can automate the publishing process using GitHub Actions by creating a workflow that triggers on new releases:

   - Create a `.github/workflows/publish.yml` file in your repository:
     ```yaml
     name: Publish Package to npm

     on:
       release:
         types: [published]

     jobs:
       build:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v4
           - uses: actions/setup-node@v4
             with:
               node-version: '16.x'
               registry-url: 'https://registry.npmjs.org'
           - run: npm ci
           - run: npm publish --access public
             env:
               NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
     ```
   - Store your npm authentication token as a secret in your GitHub repository settings under `NPM_TOKEN`.

6. **Verify Publication**

   After publishing, verify that your package is available on the npm registry by searching for it or checking your profile on the npm website.
