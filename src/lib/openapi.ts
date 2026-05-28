/**
 * OpenAPI 3.0 specification for Console Repair API routes.
 * Served at GET /api/openapi and used by /api-docs (Swagger UI).
 */

const DEFAULT_BASE_URL = "http://localhost:3000";

export function resolveApiBaseUrl(requestOrigin?: string): string {
  const fromEnv =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  if (requestOrigin) {
    return requestOrigin.replace(/\/$/, "");
  }
  return DEFAULT_BASE_URL;
}

export function buildOpenApiDocument(baseUrl: string = DEFAULT_BASE_URL) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  return {
  openapi: "3.0.3",
  info: {
    title: `Console Repair API [ Base URL: ${normalizedBaseUrl} ]`,
    description:
      "REST API for authentication (JWT Bearer), repair orders, admin management, and game catalog (RAWG proxy). Use **Authorize** to set `Bearer <access_token>` after login or OTP verify.",
    version: "1.0.0",
  },
  servers: [
    {
      url: normalizedBaseUrl,
      description: "API server",
    },
  ],
  tags: [
    { name: "auth", description: "Login, OTP, password reset, and token refresh" },
    { name: "Repair", description: "Public repair request and order tracking" },
    { name: "Admin", description: "Admin-only order management (Bearer required)" },
    { name: "Games", description: "Game catalog by console (RAWG)" },
  ],
  components: {
    securitySchemes: {
      Bearer: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description:
          'JWT access token. Format: `Bearer <access_token>` (from login, verify-otp, or token refresh).',
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
      TokenPair: {
        type: "object",
        required: ["access", "refresh"],
        properties: {
          access: { type: "string", description: "JWT access token" },
          refresh: { type: "string", description: "JWT refresh token" },
        },
      },
      AuthUser: {
        type: "object",
        properties: {
          id: { type: "integer" },
          phone: { type: "string", pattern: "^09\\d{9}$" },
          username: { type: "string" },
          name: { type: "string" },
          role: { type: "string", enum: ["admin", "user"] },
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
        security: [{ Bearer: [] }],
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
        security: [{ Bearer: [] }],
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
        security: [{ Bearer: [] }],
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
    "/auth/login/": {
      post: {
        tags: ["auth"],
        operationId: "auth_login_create",
        summary: "Login",
        description:
          "Authenticate with phone/username and password. Returns JWT access and refresh tokens.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  phone: {
                    type: "string",
                    pattern: "^09\\d{9}$",
                    example: "09123456789",
                  },
                  username: { type: "string" },
                  password: { type: "string", format: "password" },
                },
                required: ["password"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Authenticated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    access: { type: "string" },
                    refresh: { type: "string" },
                    user: { $ref: "#/components/schemas/AuthUser" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid credentials",
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
        },
      },
    },
    "/auth/password/reset/send/": {
      post: {
        tags: ["auth"],
        operationId: "auth_password_reset_send_create",
        summary: "Send password reset OTP",
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
            description: "Reset code sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
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
        },
      },
    },
    "/auth/password/reset/verify/": {
      post: {
        tags: ["auth"],
        operationId: "auth_password_reset_verify_create",
        summary: "Verify password reset OTP",
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
                  code: { type: "string", example: "1234" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "OTP verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    reset_token: {
                      type: "string",
                      description: "Short-lived token for confirm step",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid or expired code",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/auth/password/reset/confirm/": {
      post: {
        tags: ["auth"],
        operationId: "auth_password_reset_confirm_create",
        summary: "Confirm password reset",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["phone", "reset_token", "new_password"],
                properties: {
                  phone: {
                    type: "string",
                    pattern: "^09\\d{9}$",
                    example: "09123456789",
                  },
                  reset_token: { type: "string" },
                  new_password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid token or password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/auth/password/set/": {
      post: {
        tags: ["auth"],
        operationId: "auth_password_set_create",
        summary: "Set or change password",
        security: [{ Bearer: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["new_password"],
                properties: {
                  current_password: {
                    type: "string",
                    format: "password",
                  },
                  new_password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password set",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
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
        },
      },
    },
    "/auth/send-otp/": {
      post: {
        tags: ["auth"],
        operationId: "auth_send-otp_create",
        summary: "Send login OTP",
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
        },
      },
    },
    "/auth/token/refresh/": {
      post: {
        tags: ["auth"],
        operationId: "auth_token_refresh_create",
        summary: "Refresh access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refresh"],
                properties: {
                  refresh: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "New tokens",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenPair" },
              },
            },
          },
          "401": {
            description: "Invalid or expired refresh token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/auth/verify-otp/": {
      post: {
        tags: ["auth"],
        operationId: "auth_verify-otp_create",
        summary: "Verify login OTP",
        description:
          "Verify OTP and receive JWT tokens. Use the access token with **Authorize** (`Bearer <token>`).",
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
                  code: { type: "string", example: "1234" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    access: { type: "string" },
                    refresh: { type: "string" },
                    user: { $ref: "#/components/schemas/AuthUser" },
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
  };
}

/** Default document (localhost base URL). Prefer `buildOpenApiDocument` from the route handler. */
export const openApiDocument = buildOpenApiDocument();
