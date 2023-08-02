declare const _default: {
    APP: {
        PORT: string;
    };
    kis_server: {
        IP: string;
        PORT: string;
        WS: string;
        reconnectIntv: number;
    };
    EUREKA: {
        instance: {
            app: string;
            hostName: string;
            ipAddr: string;
            instanceId: string;
            statusPageUrl: string;
            port: {
                $: number;
                '@enabled': boolean;
            };
            vipAddress: string;
            dataCenterInfo: {
                '@class': string;
                name: string;
            };
        };
        eureka: {
            host: string;
            port: string;
            servicePath: string;
            fetchRegistry: boolean;
            registerWithEureka: boolean;
        };
    };
    MongoDB: {
        connectString: string;
    };
};
export default _default;
