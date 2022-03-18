module.exports = {
    apps : [{
        name   : "delbosquebordados.tienda-backend",
        script : "./dist/index.js",
        log_date_format: "YYYY-MM-DD HH:mm Z",
        error_file: "./logs/logs-error",
        out_file: "./logs/logs-out"
        }]
} 