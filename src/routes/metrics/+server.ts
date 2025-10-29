import { collectDefaultMetrics } from "prom-client";
import type { RequestHandler } from "@sveltejs/kit";
import { register } from "$lib/server/metrics";

collectDefaultMetrics({ register });

export const GET: RequestHandler = async () => {
	return new Response(await register.metrics(), {
		headers: {
			"Content-Type": register.contentType,
		},
	});
};
