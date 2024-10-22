/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://Mocker_owner:d9ZYGykg6COj@ep-orange-shape-a1sxzpm5.ap-southeast-1.aws.neon.tech/Mocker?sslmode=require",
  },
};
