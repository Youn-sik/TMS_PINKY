const path = require("path");
try {
    const config = require(path.join(process.cwd(), "config.json"));
    module.exports = config;
} catch (error) {
    module.exports = false;
}
