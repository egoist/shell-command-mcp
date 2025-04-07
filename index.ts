import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { dump } from "js-yaml"
import { version } from "./package.json"
import { x } from "tinyexec"
import { tokenizeArgs } from "args-tokenizer"

const allowedCommands =
  process.env.ALLOWED_COMMANDS?.split(",").map((cmd) => cmd.trim()) || []

const server = new McpServer(
  {
    name: "shell-command-mcp",
    version,
  },
  {
    capabilities: {
      logging: {},
      tools: {},
    },
  }
)

server.tool(
  "execute_command",
  "Execute a shell command",
  {
    command: z.string().describe("The shell command to execute"),
  },
  async (args) => {
    const [bin, ...commandArgs] = tokenizeArgs(args.command)

    try {
      if (!allowedCommands.includes("*") && !allowedCommands.includes(bin)) {
        throw new Error(
          `Command "${bin}" is not allowed, allowed commands: ${
            allowedCommands.length > 0 ? allowedCommands.join(", ") : "(none)"
          }`
        )
      }

      const result = await x(bin, commandArgs)

      return {
        content: [
          {
            type: "text",
            text: dump({
              exit_code: result.exitCode,
              stdout: result.stdout,
              stderr: result.stderr,
            }),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing command: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      }
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
