"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KISLoopService = exports.LoopCallback = void 0;
const common_1 = require("@nestjs/common");
const MongoDB_ITEM_MAST_1 = require("../MongoDB/Model/MongoDB.ITEM_MAST");
const MongoDB_HHDFS76200200_1 = require("../MongoDB/Model/MongoDB.HHDFS76200200");
const KIS_API_service_1 = require("./KIS.API.service");
const KIS_model_1 = require("./KIS.model");
exports.LoopCallback = new Set([
    async (recv) => {
        recv = recv.data;
        if (!recv.rsym)
            return;
        recv.updatedTime = new Date();
        recv.knam = KIS_model_1.default.knamMap[recv.rsym];
        try {
            const filter = { rsym: recv.rsym };
            const update = recv;
            const options = { upsert: true, new: true };
            const result = await MongoDB_HHDFS76200200_1.HHDFS76200200.findOneAndUpdate(filter, update, options);
        }
        catch (error) {
        }
    },
]);
let KISLoopService = class KISLoopService {
    constructor(apiService) {
        this.apiService = apiService;
        this.init()
            .then((e) => {
            console.log('KIS.refreshLoop inited');
        })
            .catch((e) => {
            console.log('KISLoopService : ' + e);
        });
        this.onDoing = true;
    }
    async init() {
        if (this.onDoing)
            return;
        const ItemList = await MongoDB_ITEM_MAST_1.ITEM_MAST.find().then((e) => e.map(({ excd, symb }) => {
            return { excd, symb };
        }));
        const HHDFS76200200 = this.apiService.HHDFS76200200;
        async function Loop(excd, symb) {
            try {
                const recv = await HHDFS76200200({
                    EXCD: excd,
                    SYMB: symb,
                });
                for (const callback of exports.LoopCallback) {
                    callback(recv);
                }
            }
            catch (err) {
            }
            finally {
                Loop(excd, symb);
            }
        }
        for (const { excd, symb } of ItemList) {
            Loop(excd, symb);
        }
    }
};
KISLoopService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [KIS_API_service_1.KISApiService])
], KISLoopService);
exports.KISLoopService = KISLoopService;
//# sourceMappingURL=KIS.refreshLoop.service.js.map