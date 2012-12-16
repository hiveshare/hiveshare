var config = module.exports;

config["hiveshare-datastore"] = {
    env: "node",       
    rootPath: "../",
    sources: [
        "lib/**/*.js"
    ],
    tests: [
        "test/*-test.js"
    ]
};

