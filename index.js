"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var dotenv = __importStar(require("dotenv"));
var mongoose_1 = __importDefault(require("mongoose"));
var helmet_1 = __importDefault(require("helmet"));
dotenv.config();
if (!process.env.PORT) {
    console.log("Error to get ports");
    process.exit(1);
}
var PORT = parseInt(process.env.PORT, 10);
var app = express_1.default();
app.use(helmet_1.default());
app.use(cors_1.default());
app.use(express_1.default.json());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", 'https://mohammadzaidhussain.github.io/*');
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   let header = req.headers["origin"] as string
//   if(header == 'https://mohammadzaidhussain.github.io/*' && !req.headers['postman-token']) {
//     next()
//   }
//   else{
//     res.status(404).json('Page not found')
//   }
// });
app.use(function (err, req, res, next) {
    if (err)
        return res.status(500).send('Syntax error' + err);
    else
        next();
});
var router = require("./src/router/router");
app.use('/registration', router);
mongoose_1.default.connect(process.env.DATABASE_URL || 'mongodb+srv://zaid21:Jam@0813@zaihamm21.bg9yp.mongodb.net/<dbname>?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, function (err) {
    if (err) {
        throw err;
    }
}).catch(function (err) {
    console.log(err);
});
exports.db = mongoose_1.default.connection;
exports.db.on('error', function (error) { return console.error(error); });
exports.db.once('open', function () { return console.log('connected to database'); });
var server = app.listen(PORT || 8000, function () {
    console.log("Listening on port " + PORT);
});
//Send message for default URL
app.get('/', function (req, res) { return res.send('Server up and running'); });
