import { Box, Text } from "ink";
import { useEffect, useState } from "react";
import get_anthropic_report from "../api/anthropic";

const AnthropicUI = () => {
    const [totalCost, setTotalCost] = useState<string>("Loading...");

    useEffect(() => {
        // Fetch the cost data when component mounts
        get_anthropic_report()
            .then(cost => setTotalCost(`Total cost: ${cost.totalCost}`))
            .catch(error => setTotalCost(`Error: ${error.message}`));
    }, []);

    return (
        <Box flexDirection="column" margin={2} borderStyle="round" padding={1}>
            <Text color="#d97757">Anthropic</Text>
            <Text>{totalCost}</Text>
        </Box>
    );
};

export default AnthropicUI;
