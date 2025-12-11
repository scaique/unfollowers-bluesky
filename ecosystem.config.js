module.exports = {
    apps: [
        {
            name: "unfollowers",
            script: "npm",
            args: "run start",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};