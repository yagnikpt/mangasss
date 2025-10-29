import { Counter, Histogram, Registry } from "prom-client";

export const httpRequestCounter = new Counter({
	name: "http_requests_total",
	help: "Total number of HTTP requests",
	labelNames: ["method", "route", "status"],
});

export const httpRequestDurationMicroseconds = new Histogram({
	name: "http_request_duration_ms",
	help: "Duration of HTTP requests in ms",
	labelNames: ["method", "route", "status"],
	buckets: [50, 100, 300, 500, 1000, 3000],
});

const register = new Registry();

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDurationMicroseconds);

export { register };
