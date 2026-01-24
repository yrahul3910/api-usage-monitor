import 'dotenv/config';
import AnthropicUI from './src/tui/anthropic';
import { Box, render } from 'ink';
import OpenRouterUI from './src/tui/openrouter';

render(
    <Box>
        <AnthropicUI />
        <OpenRouterUI />
    </Box>
);
