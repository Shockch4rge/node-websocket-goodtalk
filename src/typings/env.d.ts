declare module NodeJS {
	interface ProcessEnv {
		NODE_ENV: "development" | "production" | "test";
		LOCAL_DB_URL: string;
	}
}
