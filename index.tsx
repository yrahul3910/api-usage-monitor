import 'dotenv/config';
import AnthropicUI from './src/tui/anthropic';
import { Box, render } from 'ink';
import OpenRouterUI from './src/tui/openrouter';
import OpenAIUI from './src/tui/openai';

render(
    <Box>
        <AnthropicUI />
        <OpenRouterUI />
        <OpenAIUI />
    </Box>
);
