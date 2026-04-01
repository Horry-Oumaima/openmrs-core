const express = require("express");
const axios = require("axios");

const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-grpc");

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://otel-collector:4317",
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

const app = express();

async function checkOpenMRS() {
  const response = await axios.get("http://api:8080/openmrs", {
    timeout: 10000,
    maxRedirects: 0,
    validateStatus: (status) => [200, 301, 302, 303].includes(status),
  });

  return response;
}

app.get("/", async (req, res) => {
  console.log("Incoming request to otel-app");

  try {
    const response = await checkOpenMRS();
    console.log(`OpenMRS reachable with status ${response.status}`);
    res.status(200).send("OpenMRS OK");
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).send("Error calling OpenMRS");
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Proxy running on port 3000");
});





