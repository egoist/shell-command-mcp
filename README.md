# shell-command-mcp

MCP server for executing shell commands.

This project is sponsored by [ChatWise](https://chatwise.app), an all-in-one LLM chatbot with first-class MCP support.

## Usage

### Configure manually

```bash
# stdio server
npx -y shell-command-mcp
```

### JSON config

```json
{
  "mcpServers": {
    "shell-command": {
      "command": "npx",
      "args": ["-y", "shell-command-mcp"],
      "env": {
        "ALLOWED_COMMANDS": "cat,ls,echo"
      }
    }
  }
}
```

### Allowed commands

Use `ALLOWED_COMMANDS` environment variable to explictly allow the commands that this server can run, separate each command by `,`. You can use `*` to allow any command, but this is potentially dangerous.

## License

MIT.
