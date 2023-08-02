"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const init_1 = require("./common/init");
const MongoDB_service_1 = require("./MongoDB/MongoDB.service");
const config_1 = require("../config");
async function init() {
    const initList = { MongoDB: MongoDB_service_1.init, COMMON: init_1.init };
    await Promise.all(Object.keys(initList).map(async (service) => {
        try {
            await initList[service]();
            console.log(`service inited : ${service}`);
        }
        catch (e) {
            console.log(`service init failed : ${service}`);
            console.log(e);
        }
        return true;
    }));
    return true;
}
async function bootstrap() {
    await init();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    await app.listen(config_1.default.APP.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map