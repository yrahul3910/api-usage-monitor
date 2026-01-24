import 'dotenv/config';
import get_anthropic_credits from './src/api/anthropic';

let result = await get_anthropic_credits();
console.log(result);
