import { Box, Text } from "ink";
import { useEffect, useState } from "react";
import get_openai_costs from "../api/openai";

const OpenAIUI = () => {
    const [status, setStatus] = useState<string>("Loading...");

    useEffect(() => {
        get_openai_costs()
            .then((r) => setStatus(`Cost (30d): $${r.totalCost.toFixed(2)}`))
            .catch((error) => setStatus(`Error: ${error.message}`));
    }, []);

    return (
        <Box margin={2} borderStyle="round" padding={1} flexDirection="column">
            <Text color="#10a37f">OpenAI</Text>
            <Text>{status}</Text>
        </Box>
    );
};

export default OpenAIUI;
