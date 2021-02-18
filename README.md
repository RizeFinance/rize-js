# Rize Node.js SDK
## Installation
```
npm install @rize/rize-js
```
## Usage
```
const Rize = require('@rize/rize-js');
const rize = new Rize('your_program_id', 'your_hmac_key');

rize.complianceWorkflow.create(
    'client-generated-42',
    'tomas@example.com',
)
    .then(workflow => console.log(workflow.uid))
    .catch(error => console.log(error));
```
Or with ES modules and `async/await`:
```
import Rize from '@rize/rize-js';
const rize = new Rize('your_program_id', 'your_hmac_key');

(async () => {
    const workflow = await rize.complianceWorkflow.create(
        'client-generated-42',
        'tomas@example.com',
    );

    console.log(workflow.uid);
});
```
## Configuration
```
const rize = new Stripe('your_program_id', 'your_hmac_key', {
    environment: 'sandbox',
    timeout: 50000,
});
```
| Option        | Description                                                                     | Default  |
| ------------- | --------------------------------------------------------------------------------| -------- |
| environment   | The Rize environment to be used: `'sandbox'`, `'integration'` or `'production'` | 'sandbox'|
| timeout       | The number of milliseconds before the each request times out                    | 80000    |

## API Reference
See [docs.md](docs.md)