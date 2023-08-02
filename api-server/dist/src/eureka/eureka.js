"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = void 0;
const eureka_js_client_1 = require("eureka-js-client");
const config_1 = require("../../config");
function apply() {
    async function start() {
        try {
            client.start();
        }
        catch (e) {
            console.log(e);
        }
    }
    const client = new eureka_js_client_1.Eureka(config_1.default.EUREKA);
    client.on('deregistered', (e) => {
        start();
    });
    process.on('SIGINT', () => {
        client.stop(() => {
            console.log('Node.js app unregistered from Eureka server');
            process.exit();
        });
    });
    start();
}
exports.apply = apply;
//# sourceMappingURL=eureka.js.map