import { z } from 'zod';

// Node type definitions
export const NodeType = z.enum([
  "Start", 
  "Say", 
  "Collect", 
  "Branch", 
  "LLM", 
  "API", 
  "Handoff", 
  "End"
]);

// Individual node schemas
export const NodeSchemas = {
  Start: z.object({
    id: z.string(),
    type: z.literal("Start"),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.object({
      label: z.string().default("Start"),
      description: z.string().default("Entry point for all conversations")
    })
  }),

  Say: z.object({
    id: z.string(),
    type: z.literal("Say"),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.object({
      text: z.string().min(1).max(1000),
      bargeIn: z.boolean().default(true),
      voice: z.enum(["june", "nat", "alex", "sarah"]).default("june"),
      speed: z.number().min(0.5).max(2.0).default(1.0),
      label: z.string().default("Say")
    })
  }),

  Collect: z.object({
    id: z.string(),
    type: z.literal("Collect"),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.object({
      mode: z.enum(["speech", "dtmf", "both"]).default("speech"),
      grammar: z.array(z.string()).optional(),
      regex: z.string().optional(),
      timeoutMs: z.number().min(500).max(30000).default(4000),
      retries: z.number().min(0).max(5).default(2),
      interruptMs: z.number().min(50).max(500).default(120),
      prompt: z.string().min(1),
      noInputPrompt: z.string().optional(),
      invalidPrompt: z.string().optional(),
      label: z.string().default("Collect")
    })
  }),

  Branch: z.object({
    id: z.string(),
    type: z.literal("Branch"),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.object({
      condition: z.string().min(1),
      description: z.string().optional(),
      label: z.string().default("Branch")
    })
  }),

  LLM: z.object({
    id: z.string(),
    type: z.literal("LLM"),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.object({
      model: z.enum(["gpt-4", "gpt-3.5-turbo", "claude-3-sonnet"]).default("gpt-4"),
      systemPrompt: z.string().min(1),
      userPrompt: z.string().min(1),
      temperature: z.number().min(0).max(2).default(0.7),
      maxTokens: z.number().min(1).max(4000).default(150),
      jsonSchema: z.any().optional(),
      tools: z.array(z.any()).optional(),
      label: z.string().default("LLM")
    })
  }),

  API: z.object({
    id: z.string(),
    type: z.literal("API"),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.object({
      method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).default("POST"),
      url: z.string().url(),
      headers: z.record(z.string()).optional(),
      body: z.any().optional(),
      timeoutMs: z.number().min(100).max(10000).default(3000),
      retries: z.number().min(0).max(3).default(1),
      label: z.string().default("API Call")
    })
  }),

  Handoff: z.object({
    id: z.string(),
    type: z.literal("Handoff"),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.object({
      number: z.string().min(1),
      whisperPrompt: z.string().optional(),
      contextData: z.record(z.any()).optional(),
      department: z.enum(["sales", "support", "billing"]).optional(),
      priority: z.enum(["low", "medium", "high"]).default("medium"),
      label: z.string().default("Handoff")
    })
  }),

  End: z.object({
    id: z.string(),
    type: z.literal("End"),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.object({
      disposition: z.enum([
        "booked", 
        "qualified", 
        "not_interested", 
        "callback", 
        "dnc", 
        "voicemail",
        "busy",
        "no_answer"
      ]).default("not_interested"),
      message: z.string().optional(),
      label: z.string().default("End")
    })
  })
};

// Edge schema with conditional labels
export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  label: z.enum(["yes", "no", "timeout", "error", "success", "default"]).optional(),
  animated: z.boolean().default(false),
  style: z.object({
    stroke: z.string().optional(),
    strokeWidth: z.number().optional()
  }).optional()
});

// Complete flow schema
export const FlowSchema = z.object({
  schema: z.literal("vocelio.flow/v1"),
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.string().default("1.0.0"),
  created: z.string().datetime(),
  modified: z.string().datetime(),
  nodes: z.array(z.union([
    NodeSchemas.Start,
    NodeSchemas.Say,
    NodeSchemas.Collect,
    NodeSchemas.Branch,
    NodeSchemas.LLM,
    NodeSchemas.API,
    NodeSchemas.Handoff,
    NodeSchemas.End
  ])),
  edges: z.array(EdgeSchema),
  metadata: z.object({
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    complexity: z.enum(["simple", "medium", "complex"]).optional()
  }).optional()
});

// Validation helpers
export const validateNode = (node, type) => {
  try {
    return NodeSchemas[type].parse(node);
  } catch (error) {
    return { error: error.errors };
  }
};

export const validateFlow = (flow) => {
  try {
    return FlowSchema.parse(flow);
  } catch (error) {
    return { error: error.errors };
  }
};

// Node type configurations for UI
export const NodeTypeConfig = {
  Start: { 
    icon: "🚀", 
    color: "from-green-500 to-green-600", 
    category: "Control",
    description: "Starting point of the conversation flow"
  },
  Say: { 
    icon: "💬", 
    color: "from-blue-500 to-blue-600", 
    category: "Communication",
    description: "Speak text to the user with TTS"
  },
  Collect: { 
    icon: "🎤", 
    color: "from-purple-500 to-purple-600", 
    category: "Input",
    description: "Collect user input via speech or DTMF"
  },
  Branch: { 
    icon: "🔀", 
    color: "from-yellow-500 to-yellow-600", 
    category: "Logic",
    description: "Conditional branching based on variables"
  },
  LLM: { 
    icon: "🧠", 
    color: "from-pink-500 to-pink-600", 
    category: "AI",
    description: "AI-powered conversation with LLM"
  },
  API: { 
    icon: "🔗", 
    color: "from-indigo-500 to-indigo-600", 
    category: "Integration",
    description: "Make HTTP API calls to external services"
  },
  Handoff: { 
    icon: "📞", 
    color: "from-orange-500 to-orange-600", 
    category: "Transfer",
    description: "Transfer call to human agent with context"
  },
  End: { 
    icon: "🏁", 
    color: "from-red-500 to-red-600", 
    category: "Control",
    description: "End the conversation with disposition"
  }
};

export default {
  NodeType,
  NodeSchemas,
  EdgeSchema,
  FlowSchema,
  validateNode,
  validateFlow,
  NodeTypeConfig
};
