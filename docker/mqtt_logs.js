const fs = require("fs");
const path = require("path");
const base_info_json = fs.readFileSync(path.join(__dirname, "cloud40.json"));
const site = JSON.parse(base_info_json);

const crypto = require("crypto");

const sha1 = (string) => crypto.createHash('sha1').update(string).digest('hex');
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: site.maria_host,
    port: site.maria_port,
    user: site.maria_user,
    password: site.maria_passwd,
    database: site.maria_database
});

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://" + site.mongodb_user + ":" + site.mongodb_passwd + "@" + site.mongodb_host + ":27017/" + site.mongodb_database + "?poolSize=4", {
    useNewUrlParser: false
}, function(err) {
    if (err) {
        console.error("mongodb connection error", err);
    } else {
        console.log("mongodb connected");
    }
});

const xppContentLogSchema = new mongoose.Schema({
    checksum: String,
    name: String,
    serial_number: String,
    cid: String,
    edge_id: Number,
    management_id: Number,
    ux_address: String,
    template_id: String,
    frame_no: Number,
    content_id: Number,
    content_name: String,
    content_type: String,
    start_time: Number,
    end_time: Number,
    created_ut: Number,
    created_at: Date
}, {
    timestamps: true,
    collection: "xpp_content_logs"
});

xppContentLogSchema.index({ checksum: 1 });
xppContentLogSchema.index({ serial_number: 1 });
xppContentLogSchema.index({ cid: 1 });
xppContentLogSchema.index({ edge_id: 1 });
xppContentLogSchema.index({ management_id: 1 });
xppContentLogSchema.index({ ux_address: 1 });
xppContentLogSchema.index({ content_id: 1 });
xppContentLogSchema.index({ created_at: 1 });

const xppContentLogModel = mongoose.model("xpp_content_logs", xppContentLogSchema);

const xppContentLogSumSchema = new mongoose.Schema({
    name: String,
    serial_number: String,
    cid: String,
    edge_id: Number,
    management_id: Number,
    ux_address: String,
    content_id: Number,
    content_name: String,
    content_type: String,
    count: Number,
    created_ut: Number,
    created_at: Date
}, {
    timestamps: true,
    collection: "xpp_content_logs_sums"
});

xppContentLogSumSchema.index({ serial_number: 1 });
xppContentLogSumSchema.index({ cid: 1 });
xppContentLogSumSchema.index({ edge_id: 1 });
xppContentLogSumSchema.index({ management_id: 1 });
xppContentLogSumSchema.index({ ux_address: 1 });
xppContentLogSumSchema.index({ content_id: 1 });
xppContentLogSumSchema.index({ created_at: 1 });

const xppContentLogSumModel = mongoose.model("xpp_content_logs_sums", xppContentLogSumSchema);

const kssContentLogSchema = new mongoose.Schema({
    checksum: String,
    name: String,
    serial_number: String,
    cid: String,
    edge_id: Number,
    management_id: Number,
    ux_address: String,
    template_id: String,
    frame_no: Number,
    content_id: Number,
    content_name: String,
    content_type: String,
    start_time: Number,
    end_time: Number,
    created_ut: Number,
    created_at: Date
}, {
    timestamps: true,
    collection: "kss_content_logs"
});

kssContentLogSchema.index({ checksum: 1 });
kssContentLogSchema.index({ serial_number: 1 });
kssContentLogSchema.index({ cid: 1 });
kssContentLogSchema.index({ edge_id: 1 });
kssContentLogSchema.index({ management_id: 1 });
kssContentLogSchema.index({ ux_address: 1 });
kssContentLogSchema.index({ content_id: 1 });
kssContentLogSchema.index({ created_at: 1 });

const kssContentLogModel = mongoose.model("kss_content_logs", kssContentLogSchema);

const kssContentLogSumSchema = new mongoose.Schema({
    name: String,
    serial_number: String,
    cid: String,
    edge_id: Number,
    management_id: Number,
    ux_address: String,
    content_id: Number,
    content_name: String,
    content_type: String,
    count: Number,
    created_ut: Number,
    created_at: Date
}, {
    timestamps: true,
    collection: "kss_content_logs_sums"
});

kssContentLogSumSchema.index({ serial_number: 1 });
kssContentLogSumSchema.index({ cid: 1 });
kssContentLogSumSchema.index({ edge_id: 1 });
kssContentLogSumSchema.index({ management_id: 1 });
kssContentLogSumSchema.index({ ux_address: 1 });
kssContentLogSumSchema.index({ content_id: 1 });
kssContentLogSumSchema.index({ created_at: 1 });

const kssContentLogSumModel = mongoose.model("kss_content_logs_sums", kssContentLogSumSchema);

const settopLogSchema = new mongoose.Schema({
    checksum: String,
    name: String,
    serial_number: String,
    cid: String,
    edge_id: Number,
    management_id: Number,
    message: String,
    created_ut: Number,
    created_at: Date
}, {
    timestamps: true,
    collection: "stb_logs"
});

settopLogSchema.index({ checksum: 1 });
settopLogSchema.index({ serial_number: 1 });
settopLogSchema.index({ cid: 1 });
settopLogSchema.index({ edge_id: 1 });
settopLogSchema.index({ management_id: 1 });
settopLogSchema.index({ created_at: 1 });

const settopLogModel = mongoose.model("stb_logs", settopLogSchema);

module.exports = {
    progressContentLog: async(jsonString) => {
        try {
            let json = JSON.parse(jsonString);

            let is_error = false;

            let settop_types = [];

            for (let i = 0; i < json.datas.length; i++) {
                let data = json.datas[i];

                let contentLogModel, contentLogSumModel;

                if (!settop_types[data.serial_number]) {
                    let [result] = await db.query("SELECT stb_type FROM stb WHERE serial_number = ?", [data.serial_number]);
                    if (result && result.length > 0) {
                        settop_types[data.serial_number] = result[0].stb_type;
                    }
                }

                if (settop_types[data.serial_number] == "webos_hotel") {
                    contentLogModel = xppContentLogModel;
                    contentLogSumModel = xppContentLogSumModel;
                }else if (settop_types[data.serial_number]) {
                    contentLogModel = kssContentLogModel;
                    contentLogSumModel = kssContentLogSumModel;
                }else {
                    console.log("로그 데이터 스킵 (stb_type 찾을 수 없음)");
                    continue;
                }

                for (let k = 0; k < data.values.length; k++) {
                    let value = data.values[k];

                    if (!data.edge_id) {
                        console.log("컨텐츠 로그 스킵 (Edge_id 없음)");
                        continue;
                    }

                    //let hashTarget = data.serial_number + data.cid + data.edge_id + data.management_id + value.ux_address +
                    //    value.template_id + value.frame_no + value.content_id + value.start_time + value.created_ut;
                    
                    //let checksum = sha1(hashTarget);

                    let checksum = value.template_id + value.frame_no + value.start_time;

                    let logNow = new Date(value.created_ut * 1000);

                    let existLog = false;

                    try {
                        existLog = await contentLogModel.find({
                            checksum: checksum,
                            serial_number: data.serial_number,
                            content_id: Number(value.content_id),
                            created_at: logNow
                        });
                    } catch (error) {}

                    if (existLog && existLog.length > 0) {
                        // 중복되는 로그
                        continue;
                    }
                    try {
                        await new contentLogModel({
                            checksum: checksum,
                            name: data.name,
                            serial_number: data.serial_number,
                            cid: data.cid,
                            edge_id: Number(data.edge_id),
                            management_id: Number(data.management_id),
                            ux_address: value.ux_address,
                            template_id: value.template_id,
                            frame_no: Number(value.frame_no),
                            content_id: Number(value.content_id),
                            content_name: value.content_name,
                            content_type: value.content_type,
                            start_time: Number(value.start_time),
                            end_time: Number(value.end_time),
                            created_ut: value.created_ut,
                            created_at: logNow
                        }).save();
                    } catch (error) {
                        //console.error(error);
                        console.log("컨텐츠 로그 데이터 오류.");
                        is_error = true;
                        break;
                    }

                    let existLogSum = false;

                    try {
                        existLogSum = await contentLogSumModel.find({
                            serial_number: data.serial_number,
                            ux_address: value.ux_address,
                            content_id: value.content_id,
                            created_at: {
                                $gte: new Date(logNow.getFullYear(), logNow.getMonth(), logNow.getDate()),
                                $lt: new Date(logNow.getFullYear(), logNow.getMonth(), logNow.getDate() + 1)
                            }
                        });
                    } catch (error) {}

                    if (existLogSum && existLogSum.length > 0) {
                        try {
                            await existLogSum[0].updateOne({
                                $inc: {
                                    count: 1
                                }
                            });
                        } catch (error) {
                            console.error(error);
                            is_error = true;
                            break;
                        }
                    } else {
                        try {
                            await new contentLogSumModel({
                                name: data.name,
                                serial_number: data.serial_number,
                                cid: data.cid,
                                edge_id: Number(data.edge_id),
                                management_id: Number(data.management_id),
                                ux_address: value.ux_address,
                                content_id: Number(value.content_id),
                                content_name: value.content_name,
                                content_type: value.content_type,
                                count: 1,
                                created_ut: value.created_ut,
                                created_at: new Date(value.created_ut * 1000)
                            }).save();
                        } catch (error) {
                            console.error(error);
                            is_error = true;
                            break;
                        }
                    }
                }

                if (is_error) break;
            }

            return is_error ? false : true;

        } catch (error) {
            console.error(error);
            return false;
        }
    },
    progressSettopLog: async(jsonString) => {
        try {
            let json = JSON.parse(jsonString);

            let is_error = false;

            for (let k = 0; k < json.values.length; k++) {
                let value = json.values[k];

                if (!value.edge_id) {
                    console.log("세탑 로그 스킵 (Edge_id 없음)");
                    continue;
                }

                //let hashTarget = value.serial_number + value.cid + value.edge_id + value.management_id + value.message + value.created_ut;
                //let checksum = sha1(hashTarget);

                let logNow = new Date(value.created_ut * 1000);

                let checksum = value.message;

                let existLog = false;
                try {
                    existLog = await settopLogModel.find({
                        checksum: checksum,
                        serial_number: value.serial_number,
                        created_at: logNow
                    });
                } catch (error) {}

                if (existLog && existLog.length > 0) {
                    // 중복되는 로그
                    console.log("세탑 로그 중복!" + value.message);
                    continue;
                }

                try {
                    await new settopLogModel({
                        checksum: checksum,
                        name: value.name,
                        serial_number: value.serial_number,
                        cid: value.cid,
                        edge_id: Number(value.edge_id),
                        management_id: Number(value.management_id),
                        message: value.message,
                        created_ut: value.created_ut,
                        created_at: logNow
                    }).save();
                } catch (error) {
                    //console.error(error);
                    console.log("세탑 로그 데이터 오류.");
                    is_error = true;
                    break;
                }
            }

            return is_error ? false : true;

        } catch (error) {
            console.error(error);
            return false;
        }
    }
};
