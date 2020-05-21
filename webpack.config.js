const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = async (env, argv) => {
    const config = await createExpoWebpackConfigAsync(env, argv);

    config.resolve.alias = {
        ...config.resolve.alias,
        // Use Preact aliases
        react$: "preact/compat",
        "react-dom$": "preact/compat",
        // Fix the responder system which react-native-web depends on
        "react-dom/unstable-native-dependencies$":
            "preact-responder-event-plugin",
    };

    // Optionally you can enable the bundle size report.
    // It's best to do this only with production builds.
    // If you use it, be sure to install it with `yarn add -D webpack-bundle-analyzer`
    if (env.mode === "production") {
        config.plugins.push(
            new BundleAnalyzerPlugin({
                path: "web-report",
            })
        );
    }
    return config;
};
