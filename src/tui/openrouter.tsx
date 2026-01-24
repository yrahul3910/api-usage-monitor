import { Box, Text } from "ink";
import { useEffect, useState } from "react";
import get_openrouter_report from "../api/openrouter";

const OpenRouterUI = () => {
    const [totalCost, setTotalCost] = useState<string>("Loading...");
    const [creditBalance, setCreditBalance] = useState<string>("Loading...");

    useEffect(() => {
        // Fetch the cost data when component mounts
        get_openrouter_report()
            .then(data => {
                let remaining = data.total_credits - data.total_usage;

                setTotalCost(`Total cost: $${data.total_usage}`);
                setCreditBalance(`Credits remaining: $${remaining}`);
            })
            .catch(error => setTotalCost(`Error: ${error.message}`));
    }, []);

    return (
        <Box margin={2} borderStyle="round" padding={1} flexDirection="column">
            <Text>{totalCost}</Text>
            <Text>{creditBalance}</Text>
        </Box>
    );
};

export default OpenRouterUI;
