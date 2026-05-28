/**
 * OpenAPI 3.0 specification for Console Repair API routes.
 * Served at GET /api/openapi and used by /api-docs (Swagger UI).
 */
export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Console Repair API",
    description:
      "REST API for repair orders, authentication, admin management, and game catalog (RAWG proxy).",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/",
      description: "Current host",
    },
  ],
  tags: [
    { name: "Repair", description: "Public repair request and order tracking" },
    { name: "Admin", description: "Admin-only order management (session required)" },
    { name: "Auth", description: "Login, OTP, and session" },
    { name: "Games", description: "Game catalog by console (RAWG)" },
  ],
  components: {
    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "console_session",
        description:
          "HTTP-only session cookie set by POST /api/auth/login or POST /api/auth/otp/verify. Admin routes require role `admin`.",
      },
    },
    schemas: {
      ApiError: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", description: "Persian error message" },
        },
      },
      SessionUser: {
        type: "object",
        required: ["name", "role"],
        properties: {
          name: { type: "string", example: "Admin" },
          role: { type: "string", enum: ["admin", "user"] },
        },
      },
      RepairStatus: {
        type: "string",
        enum: ["pending", "checking", "repairing", "completed"],
      },
      RepairOrder: {
        type: "object",
        required: [
          "trackingCode",
          "name",
          "phone",
          "device",
          "issue",
          "description",
          "image",
          "status",
          "createdAt",
        ],
        properties: {
          trackingCode: { type: "string", example: "A1B2C3" },
          name: { type: "string" },
          phone: {
            type: "string",
            pattern: "^09\\d{9}$",
            description: "Iranian mobile (09xxxxxxxxx)",
          },
          device: { type: "string" },
          issue: { type: "string" },
          description: { type: "string" },
          image: {
            type: "string",
            description: "Public URL path to uploaded image, or empty string",
          },
          status: { $ref: "#/components/schemas/RepairStatus" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      RawgGame: {
        type: "object",
        properties: {
          id: { type: "integer" },
          slug: { type: "string" },
          name: { type: "string" },
          released: { type: "string", nullable: true },
          backgroundImage: { type: "string", nullable: true },
          rating: { type: "number", nullable: true },
          metacritic: { type: "number", nullable: true },
        },
      },
    },
  },
  paths: {
    "/api/repair": {
      post: {
        tags: ["Repair"],
        summary: "Submit a repair request",
        description:
          "Creates a repair order. Accepts `multipart/form-data`. Optional image: JPEG, PNG, WebP, or GIF, max 5 MB.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["phone"],
                properties: {
                  name: { type: "string" },
                  phone: {
                    type: "string",
                    pattern: "^09\\d{9}$",
                    example: "09123456789",
                  },
                  device: { type: "string", default: "دستگاه نامشخص" },
                  issue: { type: "string" },
                  description: { type: "string" },
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Order created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    trackingCode: { type: "string" },
                    order: { $ref: "#/components/schemas/RepairOrder" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation or image error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/repair/orders/{code}": {
      get: {
        tags: ["Repair"],
        summary: "Get order by tracking code",
        parameters: [
          {
            name: "code",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Tracking code (case-insensitive)",
          },
        ],
        responses: {
          "200": {
            description: "Order found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    order: { $ref: "#/components/schemas/RepairOrder" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Order not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Repair", "Admin"],
        summary: "Update order status (admin)",
        security: [{ sessionCookie: [] }],
        parameters: [
          {
            name: "code",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { $ref: "#/components/schemas/RepairStatus" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Status updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    order: { $ref: "#/components/schemas/RepairOrder" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "404": {
            description: "Order not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/admin/orders": {
      get: {
        tags: ["Admin"],
        summary: "List all repair orders",
        security: [{ sessionCookie: [] }],
        responses: {
          "200": {
            description: "Order list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    orders: {
                      type: "array",
                      items: { $ref: "#/components/schemas/RepairOrder" },
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/admin/orders/{code}": {
      patch: {
        tags: ["Admin"],
        summary: "Update order status by tracking code",
        security: [{ sessionCookie: [] }],
        parameters: [
          {
            name: "code",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { $ref: "#/components/schemas/RepairStatus" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Status updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    order: { $ref: "#/components/schemas/RepairOrder" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "404": {
            description: "Order not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with username and password",
        description:
          "Admin credentials (from env) receive role `admin`. Any other username/password pair receives role `user` and a session.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  username: { type: "string" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Logged in; sets `console_session` cookie",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    user: { $ref: "#/components/schemas/SessionUser" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Missing credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Clear session",
        responses: {
          "200": {
            description: "Session cleared",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current session user",
        responses: {
          "200": {
            description: "Session state",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    user: {
                      oneOf: [
                        { $ref: "#/components/schemas/SessionUser" },
                        { type: "null" },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/otp/send": {
      post: {
        tags: ["Auth"],
        summary: "Send OTP to mobile number",
        description:
          "In development, response may include `devCode`. OTP is logged to the server console in development.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["phone"],
                properties: {
                  phone: {
                    type: "string",
                    pattern: "^09\\d{9}$",
                    example: "09123456789",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "OTP sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                    devCode: {
                      type: "string",
                      description: "Present only in development",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid phone",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/auth/otp/verify": {
      post: {
        tags: ["Auth"],
        summary: "Verify OTP and create user session",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["phone", "code"],
                properties: {
                  phone: {
                    type: "string",
                    pattern: "^09\\d{9}$",
                    example: "09123456789",
                  },
                  code: { type: "string", example: "A1B2" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Verified; sets `console_session` cookie",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    user: { $ref: "#/components/schemas/SessionUser" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid or expired OTP",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "401": {
            description: "Wrong code",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/games": {
      get: {
        tags: ["Games"],
        summary: "List games for a console",
        parameters: [
          {
            name: "console",
            in: "query",
            required: true,
            schema: {
              type: "string",
              enum: ["ps4", "ps5", "xbox-one", "xbox-series"],
            },
          },
          {
            name: "filter",
            in: "query",
            schema: {
              type: "string",
              enum: ["popular", "newest", "best", "metacritic"],
              default: "best",
            },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "pageSize",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 40,
              default: 24,
            },
          },
        ],
        responses: {
          "200": {
            description: "Paginated game list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    console: { type: "string" },
                    games: {
                      type: "array",
                      items: { $ref: "#/components/schemas/RawgGame" },
                    },
                    count: { type: "integer" },
                    page: { type: "integer" },
                    pageSize: { type: "integer" },
                    hasNext: { type: "boolean" },
                    filter: {
                      type: "string",
                      enum: ["popular", "newest", "best", "metacritic"],
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid query parameters",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "502": {
            description: "RAWG upstream error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "503": {
            description: "RAWG_API_KEY not configured",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
  },
} as const;
