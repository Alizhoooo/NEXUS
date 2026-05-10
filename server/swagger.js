import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NEXUS API',
      version: '1.0.0',
      description: 'NEXUS Automation Platform API\n\nAuthentication: Bearer token in Authorization header',
      contact: {
        name: 'NEXUS Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string' },
            accessRole: { type: 'string', enum: ['Admin', 'HR', 'Finance', 'Manager', 'Employee'] },
            department: { type: 'string' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
            assignee: { type: 'object' },
            dueDate: { type: 'string' },
            comments: { type: 'number' },
            subtasksTotal: { type: 'number' },
            subtasksCompleted: { type: 'number' }
          }
        },
        Employee: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            department: { type: 'string' },
            status: { type: 'string', enum: ['Active', 'On Leave', 'Remote'] },
            imageUrl: { type: 'string' },
            workload: { type: 'number' },
            location: { type: 'string' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' }
          }
        },
        TaskCreateRequest: {
          type: 'object',
          required: ['title', 'priority', 'assigneeId'],
          properties: {
            title: { type: 'string', minLength: 2, maxLength: 120 },
            description: { type: 'string', maxLength: 1000 },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
            assigneeId: { type: 'string' }
          }
        },
        TaskUpdateRequest: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    paths: {
      '/api/health': {
        get: {
          summary: 'Health check',
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      timestamp: { type: 'string' },
                      database: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/auth/login': {
        post: {
          summary: 'User login',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' }
              }
            }
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginResponse' }
                }
              }
            },
            '401': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/bootstrap': {
        get: {
          summary: 'Get initial application data',
          tags: ['Data'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'number', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'number', default: 20 } }
          ],
          responses: {
            '200': {
              description: 'Bootstrap data'
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        }
      },
      '/api/tasks': {
        post: {
          summary: 'Create a new task',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskCreateRequest' }
              }
            }
          },
          responses: {
            '201': {
              description: 'Task created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Task' }
                }
              }
            }
          }
        }
      },
      '/api/employees': {
        get: {
          summary: 'Get employees with pagination',
          tags: ['Employees'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'number', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'number', default: 20 } },
            { name: 'search', in: 'query', schema: { type: 'string' } }
          ],
          responses: {
            '200': {
              description: 'Employees list'
            }
          }
        }
      },
      '/api/assistant': {
        post: {
          summary: 'AI Assistant chat',
          tags: ['AI'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: { type: 'string', maxLength: 2000 },
                    history: { type: 'array' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'AI response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      text: { type: 'string' }
                    }
                  }
                }
              }
            },
            '429': {
              description: 'Rate limit exceeded'
            }
          }
        }
      }
    }
  },
  apis: ['./server/*.js']
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'NEXUS API Documentation',
    customfavIcon: '/favicon.ico'
  }));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('[Docs] Swagger available at http://localhost:3001/api-docs');
};

export default swaggerDocs;