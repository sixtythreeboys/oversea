"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    APP: {
        PORT: '8080',
    },
    kis_server: {
        IP: 'localhost',
        PORT: '8081',
        WS: 'ws://localhost:8081/socket',
        reconnectIntv: 20000,
    },
    EUREKA: {
        instance: {
            app: 'oversea',
            hostName: 'ec2-3-136-15-208.us-east-2.compute.amazonaws.com',
            ipAddr: 'ec2-3-136-15-208.us-east-2.compute.amazonaws.com',
            instanceId: 'oversea',
            statusPageUrl: 'http://ec2-3-136-15-208.us-east-2.compute.amazonaws.com:8082/test',
            port: {
                $: 8080,
                '@enabled': true,
            },
            vipAddress: 'oversea',
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
        },
        eureka: {
            host: '15.164.171.244',
            port: '8761',
            servicePath: '/eureka/apps',
            fetchRegistry: true,
            registerWithEureka: true,
        },
    },
    MongoDB: {
        connectString: 'mongodb+srv://oversea:oversea@63stockoversea.hgudvi2.mongodb.net/?retryWrites=true&w=majority',
    },
};
//# sourceMappingURL=config.js.map